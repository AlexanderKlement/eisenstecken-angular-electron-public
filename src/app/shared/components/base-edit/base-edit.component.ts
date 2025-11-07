import { Component, OnDestroy, OnInit } from "@angular/core";
import { firstValueFrom, Observable, ReplaySubject, Subscription } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { DataSourceClass } from "../../types";
import { MatDialog } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { DefaultService, User, Lock } from "../../../../api/openapi";
import { AbstractControl } from "@angular/forms";
import { BackStackService } from "../../../src/app/shared/services/back-stack.service";
import { NavigationService } from "../../services/navigation.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ReusableRoute } from "../../reusable-route";


@Component({
  selector: 'app-base-edit',
  template: ``,
  styleUrls: ['./base-edit.component.scss'],
  standalone: false,
})
export class BaseEditComponent<T extends DataSourceClass> implements OnInit, OnDestroy, ReusableRoute {

  //This has to be defined by Derived class:
  navigationTarget: string;
  lockFunction: (api: DefaultService, id: number) => Observable<Lock>;
  unlockFunction: (api: DefaultService, id: number) => Observable<boolean>;
  dataFunction: (api: DefaultService, id: number) => Observable<T>;

  //this not:
  me$: Observable<User>;
  data$: Observable<T>;
  createMode = false;
  id: number;
  submitted = false;
  routeParams: ReplaySubject<Params> = new ReplaySubject<Params>(1);
  subscription: Subscription;

  private controlsBeforeBack: AbstractControl[] = [];
  private controlsSub?: Subscription;
  private atLeastOneFormModified = false;
  private disposeBackHandler?: () => void;

  constructor(protected api: DefaultService,
              protected router: Router,
              protected route: ActivatedRoute,
              public dialog: MatDialog,
              protected backStack: BackStackService,
              protected navigation: NavigationService) {
    this.subscription = new Subscription();
    this.subscription.add(this.route.params.subscribe((params) => this.routeParams.next(params)));
  }

  public onAttach(): void {
    if ((this as any).controlsBeforeBack?.length) {
      this["registerDirtyControls"](this["controlsBeforeBack"]);
    }
  }

  public onDetach(): void {
    if ((this as any).disposeBackHandler) {
      this["disposeBackHandler"]();
      this["disposeBackHandler"] = undefined;
    }
  }

  ngOnInit(): void {
    this.me$ = this.api.readUsersMeUsersMeGet();
    this.routeParams.pipe(first()).subscribe((params) => {
      if (params.id === "new") {
        this.createMode = true;
        return;
      }
      this.id = parseInt(params.id, 10);
      if (isNaN(this.id)) {
        console.error("BaseEditComponent: Cannot parse given id");
        this.goBack();
      }
      if (!this.createMode) {
        this.lockFunction(this.api, this.id).pipe(first()).subscribe(lock => {
          if (!lock.locked) {//has to be locked, otherwise component is accessed directly {
            console.error("BaseEditComponent: The lock is not locked. This should not happen on accessing a ressource");
            this.goBack();
          }
          this.me$.pipe(first()).subscribe((user) => {
            if (user.id !== lock.user.id) {//if locked by other user go back
              console.error("BaseEditComponent: The accessed ressource is locked by another user");
              this.goBack();
            } else {   //now we talking
              this.data$ = this.dataFunction(this.api, this.id);
              this.observableReady();
            }
          });
        });
      }
    });
    this.startListeningForUnload();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.controlsSub?.unsubscribe();
    this.disposeBackHandler?.(); // remove back handler if set

    if (!this.createMode) {
      this.unlockFunction(this.api, this.id).pipe(first()).subscribe((success) => {
        if (success) {
          console.info("BaseEdit: SUCCESS: unlocked object with id: " + this.id);
        } else {
          console.warn("BaseEdit: FAIL: to unlock object with id: " + this.id);
        }
      });
    }
    this.stopListeningForUnload();
  }

  protected registerDirtyControls(controls: AbstractControl[]): void {
    this.controlsBeforeBack = controls.filter(Boolean) as AbstractControl[];
    this.controlsSub?.unsubscribe();

    if (!this.controlsBeforeBack.length) return;

    // Subscribe to value changes and flip into "dirty" mode as soon as any control is dirty.
    this.controlsSub = new Subscription();
    for (const ctrl of this.controlsBeforeBack) {
      this.controlsSub.add(
        ctrl.valueChanges.subscribe(() => {
          // as soon as any control becomes dirty, enable the back handler once
          if (!this.atLeastOneFormModified && this.controlsBeforeBack.some(c => c.dirty)) {
            this.formBecameDirty();
          }
        }),
      );
    }
  }

  protected resetDirtyState(): void {
    this.atLeastOneFormModified = false;
    this.disposeBackHandler?.();
    this.disposeBackHandler = undefined;

    // reset Angular's dirty flags (derived class typically calls form.markAsPristine())
    for (const c of this.controlsBeforeBack) {
      c.markAsPristine();
      c.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }


  createUpdateError(error: any): void {
    this.submitted = false;
    console.error(error);
  }

  createUpdateComplete(): void {
    this.submitted = false;
  }

  protected goBack(): void {
    this.router.navigateByUrl(this.navigationTarget);
  }

  protected observableReady(): void {
    console.info("BaseEditComponent: The data observable is ready");
  }

  private startListeningForUnload(): void {
    window.addEventListener("beforeunload", this.ngOnDestroy.bind(this));
  }

  private stopListeningForUnload(): void {
    window.removeEventListener("beforeunload", this.ngOnDestroy.bind(this));
  }

  private beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (this.atLeastOneFormModified) {
      e.preventDefault();
      e.returnValue = "";
    }
  };

  private formBecameDirty(): void {
    this.atLeastOneFormModified = true;

    if (!this.disposeBackHandler) {
      // Register top-of-stack handler: open confirm dialog and consume back
      this.disposeBackHandler = this.backStack.push(() => {
        this.openDiscardDialog().then((confirmed) => {
          if (confirmed) {
            // If the back was initiated by browser or ESC, this will go one step back.
            // If initiated by your own UI, it behaves the same.
            this.navigation.back();
          }
        });
        return true; // consume back/ESC
      });
    }
  }

  private async openDiscardDialog(): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { title: "Änderungen verwerfen?", text: "Mindestens ein Eingabefeld wurde bearbeitet." },
    });
    const result = await firstValueFrom(ref.afterClosed().pipe(first()));
    return !!result;
  }

  protected markTreePristine(c: AbstractControl): void {
    c.markAsPristine();
    // @ts-expect-error instance checks at runtime are fine
    if (c.controls) {
      const controls = (c as any).controls;
      if (Array.isArray(controls)) {
        controls.forEach(ctrl => this.markTreePristine(ctrl));
      } else {
        Object.values(controls).forEach((ctrl: AbstractControl) => this.markTreePristine(ctrl));
      }
    }
  }
}

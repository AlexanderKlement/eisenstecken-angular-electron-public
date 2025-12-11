import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, ReplaySubject, Subscription } from "rxjs";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { first } from "rxjs/operators";
import { DefaultService, User, Lock } from "../../../../api/openapi";
import { AbstractControl } from "@angular/forms";
import { ReusableRoute } from "../../reusable-route";
import { DirtyAware } from "../../guards/dirty-form.guard";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";

@Component({
    selector: 'app-base-edit',
    template: ``,
    styleUrls: ['./base-edit.component.scss'],
})
export class BaseEditComponent<T> implements OnInit, OnDestroy, ReusableRoute, DirtyAware {

  // to be provided by derived class:
  navigationTarget: string;
  lockFunction!: (api: DefaultService, id: number) => Observable<Lock>;
  unlockFunction!: (api: DefaultService, id: number) => Observable<boolean>;
  dataFunction!: (api: DefaultService, id: number) => Observable<T>;

  // shared:
  me$!: Observable<User>;
  data$!: Observable<T>;
  createMode = false;
  id!: number;
  submitted = false;
  routeParams: ReplaySubject<Params> = new ReplaySubject<Params>(1);
  subscription = new Subscription();

  // dirty tracking (for CanDeactivate)
  protected controlsBeforeBack: AbstractControl[] = [];
  private controlsSub?: Subscription;

  constructor(
    protected api: DefaultService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected dialog: MatDialog
  ) {
    this.subscription.add(this.route.params.subscribe((p) => this.routeParams.next(p)));
  }

  // === Route reuse hooks ===
  public onAttach(): void {
    // re-arm listeners when the cached view becomes active again
    if (this.controlsBeforeBack.length) {
      this.registerDirtyControls(this.controlsBeforeBack);
    }
  }

  public onDetach(): void {
    // drop subscriptions while cached
    this.controlsSub?.unsubscribe();
    this.controlsSub = undefined;
  }

  ngOnInit(): void {
    this.me$ = this.api.readUsersMeUsersMeGet();

    this.routeParams.pipe(first()).subscribe((params) => {
      if (params.id === "new") {
        this.createMode = true;
        this.observableReady();
        return;
      }

      this.id = parseInt(params.id, 10);
      if (isNaN(this.id)) {
        console.error("BaseEditComponent: Cannot parse given id");
        this.goBack();
        return;
      }

      if (!this.createMode) {
        this.lockFunction(this.api, this.id).pipe(first()).subscribe((lock) => {
          if (!lock.locked) {
            console.error("BaseEditComponent: Expected resource to be locked.");
            this.goBack();
            return;
          }
          this.me$.pipe(first()).subscribe((user) => {
            if (user.id !== lock.user.id) {
              console.error("BaseEditComponent: Resource is locked by another user.");
              this.goBack();
              return;
            }
            this.data$ = this.dataFunction(this.api, this.id);
            this.observableReady();
          });
        });
      } else {
        this.observableReady();
      }
    });

    // optional: warn on tab close/refresh if dirty
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.controlsSub?.unsubscribe();

    if (!this.createMode) {
      this.unlockFunction(this.api, this.id).pipe(first()).subscribe((success) => {
        if (success) {
          console.info("BaseEdit: SUCCESS: unlocked object with id:", this.id);
        } else {
          console.warn("BaseEdit: FAIL: to unlock object with id:", this.id);
        }
      });
    }

    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  }

  /**
   * Derived components should call this once the main form(s) are built & initial patches are done.
   */
  protected registerDirtyControls(controls: AbstractControl[]): void {
    this.controlsBeforeBack = (controls || []).filter(Boolean) as AbstractControl[];
    this.controlsSub?.unsubscribe();
    if (!this.controlsBeforeBack.length) return;

    this.controlsSub = new Subscription();
    // We don’t need to flip any flags here—CanDeactivate will just call isDirty()
    // But we subscribe so derived classes can optionally hook side-effects later if desired.
    for (const ctrl of this.controlsBeforeBack) {
      this.controlsSub.add(ctrl.valueChanges.subscribe(() => { /* no-op */ }));
    }
  }

  /**
   * Used by the CanDeactivate guard.
   */
  public isDirty(): boolean {
    return this.controlsBeforeBack.some(c => c.dirty);
  }

  /**
   * Helper for derived classes after a successful save or load.
   */
  protected resetDirtyState(): void {
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

  public async confirmDiscard(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Änderungen verwerfen?",
        text: "Du hast ungespeicherte Änderungen. Willst du diese wirklich verwerfen?",
        confirm: "Verwerfen",
        cancel: "Abbrechen"
      }
    });

    return await dialogRef.afterClosed().toPromise();
  }

  protected goBack(): void {
    this.router.navigateByUrl(this.navigationTarget);
  }

  protected observableReady(): void {
    // Hook for derived classes
    console.info("BaseEditComponent: data observable ready");
  }

  protected markTreePristine(c: AbstractControl): void {
    c.markAsPristine();
    // recurse into groups/arrays
    const anyC: any = c as any;
    const kids = anyC?.controls;
    if (!kids) return;

    if (Array.isArray(kids)) {
      kids.forEach((ctrl: AbstractControl) => this.markTreePristine(ctrl));
    } else {
      Object.values(kids).forEach((ctrl: AbstractControl) => this.markTreePristine(ctrl as AbstractControl));
    }
  }

  // ---- Tab close / refresh prompt (optional) ----
  private beforeUnloadHandler = (e: BeforeUnloadEvent) => {
    if (this.isDirty()) {
      e.preventDefault();
      e.returnValue = "";
    }
  };
}

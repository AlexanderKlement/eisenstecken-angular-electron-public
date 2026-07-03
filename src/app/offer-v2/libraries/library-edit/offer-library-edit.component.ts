import { Component, inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import {
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { OfferLibrary, OfferUnit, OfferV2Service } from "../../../../api/openapi";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { AsyncPipe, Location } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { MatOption } from "@angular/material/core";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { CircleIconButtonComponent } from "../../../shared/components/circle-icon-button/circle-icon-button.component";
import OfferContainerComponent from "../../offer-container/offer-container.component";
import { ActivatedRoute, Router } from "@angular/router";
import { confirmDeleteDialog } from "../../offer.util";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import { MatIcon } from "@angular/material/icon";
import { selectRequires } from "../../../shared/custom-validators";


type OfferLibraryEntryGroup = {
  id: FormControl<number>;
  name: FormControl<string>;
  price: FormControl<number>;
  unit: FormControl<string>;
}

type OfferLibraryGroup = {
  name: FormControl<string>;
  description: FormControl<string>;
  entries: FormArray<FormGroup<OfferLibraryEntryGroup>>
}

@Component({
  selector: "offer-library-edit",
  templateUrl: "./offer-library-edit.component.html",
  styleUrls: ["./offer-library-edit.component.scss"],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    AsyncPipe,
    FlexModule,
    MatButton,
    MatProgressSpinner,
    MatOption,
    MatSelect,
    MatSelectModule,
    CircleIconButtonComponent,
    OfferContainerComponent,
    CdkDropList,
    CdkDrag,
    MatIcon,
    CdkDragHandle
  ]
})
export default class OfferLibraryEditComponent implements OnInit {
  private dialog = inject(MatDialog);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferV2Service);
  libraryGroup: FormGroup<OfferLibraryGroup> = new FormGroup<OfferLibraryGroup>({
    name: new FormControl("", [Validators.minLength(3), Validators.required]),
    description: new FormControl(""),
    entries: new FormArray([])
  });
  libraryId: number;
  subTitle = "Neue Bibliothek erstellen";
  units: OfferUnit[] = [];
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);
  private orderChanged = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.libraryId = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData();
    });
    this.initData();

    this.offerService.getOfferUnitsOfferV2UnitsGet().pipe(take(1)).subscribe((data) => {
      this.units = data;
    });
  }

  initData(): void {
    if (this.libraryId) {
      this.subTitle = "Bibliothek bearbeiten";
      this.offerService.getOfferLibraryOfferV2LibraryLibraryIdGet(this.libraryId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.libraryGroup = new FormGroup<OfferLibraryGroup>({
              name: new FormControl(data.name, [Validators.minLength(3), Validators.required]),
              description: new FormControl(data.description),
              entries: new FormArray(data.entries.map<FormGroup<OfferLibraryEntryGroup>>(entry => new FormGroup({
                id: new FormControl(entry.id),
                name: new FormControl(entry.name),
                price: new FormControl(entry.price),
                unit: new FormControl(entry.unit.id.toString(10), selectRequires)
              })))
            });
          },
          error: error => {
            this.snackBar.open("Die Bibliothek konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.libraryId = undefined;
            this.initData();
          }
        }
      );
    }
  }


  subscription = {
    next: (l: any) => {
      this.loadingSubject.next(false);
      if (!this.libraryId) {
        this.router.navigateByUrl(`/offer_v2/libraries/${(l as OfferLibrary).id}`).then();
      } else {
        this.location.back();
      }
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSubmitClick() {
    this.loadingSubject.next(true);
    if (this.libraryId) {
      this.offerService.patchOfferLibraryOfferV2LibraryLibraryIdPost(this.libraryId, {
        description: this.libraryGroup.get("description").value,
        name: this.libraryGroup.get("name").value,
        isManualList: false
      }).pipe(take(1)).subscribe({
        next: data => {
          const observables: Observable<any>[] = [];
          let ids: number[] = [];
          for (let i = 0; i < this.libraryGroup.controls.entries.length; i++) {
            const grp = this.libraryGroup.controls.entries.at(i);
            const id = grp.get("id").value;
            const unitId = parseInt(grp.get("unit").value, 10);
            const price = grp.get("price").value;
            const name = grp.get("name").value;
            if (id === -1) {
              ids.push(-i);
              observables.push(this.offerService.createOfferLibraryEntryOfferV2LibraryEntryPut({
                name,
                libraryId: this.libraryId,
                price,
                unitId
              }));
            } else {
              ids.push(id);
              const entry = data.entries.find(e => e.id === id);
              if (entry && (entry.name !== name || entry.price !== price || entry.unit.id !== unitId)) {
                observables.push(this.offerService.patchOfferLibraryEntryOfferV2LibraryEntryLibraryEntryIdPost(id, {
                  unitId,
                  libraryId: this.libraryId,
                  name,
                  price
                }));
              }
            }
          }
          if (observables.length === 0) {
            if (this.orderChanged) {
              this.offerService.reorderOfferLibraryEntriesOfferV2LibraryLibraryIdEntriesReorderPost(this.libraryId, { libraryEntryIds: ids }).pipe(take(1)).subscribe(this.subscription);
            } else {
              this.loadingSubject.next(false);
              this.location.back();
              return;
            }
          } else {
            forkJoin(observables).pipe(take(1)).subscribe(
              {
                next: () => {
                  if (this.orderChanged) {
                    this.offerService.getOfferLibraryOfferV2LibraryLibraryIdGet(this.libraryId).pipe(take(1)).subscribe((library) => {
                      const realIds = ids.map(id => {
                        if (id < 0) {
                          const grp = this.libraryGroup.controls.entries.at(Math.abs(id));
                          const name = grp.get("name").value;
                          const foundEntry = library.entries.find(e => e.name.trim() === name.trim());
                          if (foundEntry) {
                            return foundEntry.id;
                          }
                          return -1;
                        } else {
                          return id;
                        }
                      });
                      if (realIds.includes(-1)) {
                        console.warn("This should not happen");
                        this.loadingSubject.next(false);
                        this.location.back();
                        return;
                      } else {
                        this.offerService.reorderOfferLibraryEntriesOfferV2LibraryLibraryIdEntriesReorderPost(library.id, { libraryEntryIds: realIds }).pipe(take(1)).subscribe(() => {
                          this.loadingSubject.next(false);
                          this.location.back();
                          return;
                        });
                      }
                    });
                  } else {
                    this.loadingSubject.next(false);
                    this.location.back();
                    return;
                  }
                },
                error: () => {
                }
              });
          }
        },
        error: this.subscription.error
      });
    } else {
      this.offerService.createOfferLibraryOfferV2LibraryPut({
        description: this.libraryGroup.get("description").value ?? "",
        name: this.libraryGroup.get("name").value,
        isManualList: false
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  onDeleteEntry(id: number, idx: number): void {
    if (id === -1) {
      this.libraryGroup.controls.entries.removeAt(idx);
    } else {
      this.offerService.deleteOfferLibraryEntryOfferV2LibraryEntryLibraryEntryIdDelete(id).pipe(take(1)).subscribe({
        next: () => {
          this.libraryGroup.controls.entries.removeAt(idx);
        }, error: error => {
          this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
        }
      });
    }
  }

  onAddEntry() {
    const entry = new FormGroup<OfferLibraryEntryGroup>({
      id: new FormControl(-1),
      name: new FormControl(""),
      unit: new FormControl("-1", selectRequires),
      price: new FormControl(0)
    });
    this.libraryGroup.controls.entries.push(entry);
  }

  onDelete() {
    if (this.libraryId) {
      confirmDeleteDialog(this.libraryId,
        this.dialog,
        "Bibliothek",
        (id) => this.offerService.deleteOfferLibraryOfferV2LibraryLibraryIdDelete(id), () => {
          this.loadingSubject.next(false);
          this.location.back();
        },
        this.snackBar);
    }
  }

  protected drop(event: CdkDragDrop<any, any>) {
    const entries = this.libraryGroup.controls.entries.controls.map(grp => grp);
    moveItemInArray(entries, event.previousIndex, event.currentIndex);
    this.libraryGroup.controls.entries = new FormArray(entries);
    this.orderChanged = true;
  }
}

import { Component, inject, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { OfferLibrary, OfferUnit, OfferV2Service } from "../../../../api/openapi";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { CircleIconButtonComponent } from "../../../shared/components/circle-icon-button/circle-icon-button.component";
import OfferContainerComponent from "../../offer-container/offer-container.component";
import { ActivatedRoute, Router } from "@angular/router";
import { confirmDeleteDialog } from "../../offer.util";


type OfferLibraryEntryGroup = {
  id: FormControl<number>;
  name: FormControl<string>;
  price: FormControl<number>;
  unit: FormControl<number>;
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
    CircleIconButtonComponent,
    OfferContainerComponent
  ]
})
export default class OfferLibraryEditComponent implements OnInit {
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferV2Service);
  libraryGroup: FormGroup<OfferLibraryGroup> = new FormGroup<OfferLibraryGroup>({
    name: new FormControl(""),
    description: new FormControl(""),
    entries: new FormArray([])
  });
  libraryId: number;
  subTitle = "Neue Bibliothek erstellen";
  units$: Observable<OfferUnit[]>;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);

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

    this.units$ = this.offerService.getOfferUnitsOfferV2UnitsGet();
  }

  initData(): void {
    if (this.libraryId) {
      this.subTitle = "Bibliothek bearbeiten";
      this.offerService.getOfferLibraryOfferV2LibraryLibraryIdGet(this.libraryId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.libraryGroup = new FormGroup<OfferLibraryGroup>({
              name: new FormControl(data.name),
              description: new FormControl(data.description),
              entries: new FormArray(data.entries.map<FormGroup<OfferLibraryEntryGroup>>(entry => new FormGroup({
                id: new FormControl(entry.id),
                name: new FormControl(entry.name),
                price: new FormControl(entry.price),
                unit: new FormControl(entry.unit.id)
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
        this.libraryId = (l as OfferLibrary).id;
      } else {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSubmitClick() {
    this.loadingSubject.next(true);
    if (this.libraryId) {
      this.offerService.patchOfferLibraryOfferV2LibraryLibraryIdPost(this.libraryId, {
        description: this.libraryGroup.get("description").value,
        name: this.libraryGroup.get("name").value
      }).pipe(take(1)).subscribe({
        next: data => {
          const observables: Observable<any>[] = [];
          for (let i = 0; i < this.libraryGroup.controls.entries.length; i++) {
            const grp = this.libraryGroup.controls.entries.at(i);
            const id = grp.get("id").value;
            const unitId = grp.get("unit").value;
            const price = grp.get("price").value;
            const name = grp.get("name").value;
            if (id === -1) {
              observables.push(this.offerService.createOfferLibraryEntryOfferV2LibraryEntryPut({
                name,
                libraryId: this.libraryId,
                price,
                unitId
              }));
            } else {
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
            this.loadingSubject.next(false);
            this.router.navigateByUrl("/offer_v2/libraries").then();
            return;
          }
          forkJoin(observables).pipe(take(1)).subscribe(this.subscription);
        },
        error: this.subscription.error
      });
    } else {
      this.offerService.createOfferLibraryOfferV2LibraryPut({
        description: this.libraryGroup.get("description").value,
        name: this.libraryGroup.get("name").value
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
      unit: new FormControl(-1),
      price: new FormControl(0)
    });
    this.libraryGroup.controls.entries.push(entry);
  }

  onDelete() {
    if (this.libraryId) {
      confirmDeleteDialog(this.libraryId, this.dialog, "Bibliothek", this.offerService
        .deleteOfferLibraryOfferV2LibraryLibraryIdDelete, {
        loadData: () => {
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/offer_v2/libraries").then();
        }
      }, this.snackBar);
    }
  }
}

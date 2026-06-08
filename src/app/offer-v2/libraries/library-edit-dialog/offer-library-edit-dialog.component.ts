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
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";

export interface OfferLibraryEditData {
  library?: OfferLibrary;
}

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
  selector: "offer-library-edit-dialog",
  templateUrl: "./offer-library-edit-dialog.component.html",
  styleUrls: ["./offer-library-edit-dialog.component.scss"],
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
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ]
})
export default class OfferLibraryEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<OfferLibraryEditDialogComponent>>(MatDialogRef);
  data = inject<OfferLibraryEditData>(MAT_DIALOG_DATA);
  private offerService = inject(OfferV2Service);
  libraryGroup: FormGroup<OfferLibraryGroup>;
  libraryId: number;
  title = "Bibliothek";
  units$: Observable<OfferUnit[]>;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    if (this.data?.library) {
      this.libraryId = this.data.library.id;
      this.title = "Bibliothek bearbeiten";
    } else {
      this.title = "Neue Bibliothek erstellen";
    }
    this.initData();

    this.units$ = this.offerService.getOfferUnitsOfferV2UnitsGet();
  }

  initData(): void {
    if (this.data.library) {
      this.libraryGroup = new FormGroup<OfferLibraryGroup>({
        name: new FormControl(this.data.library.name),
        description: new FormControl(this.data.library.description),
        entries: new FormArray(this.data.library.entries.map<FormGroup<OfferLibraryEntryGroup>>(entry => new FormGroup({
          id: new FormControl(entry.id),
          name: new FormControl(entry.name),
          price: new FormControl(entry.price),
          unit: new FormControl(entry.unit.id)
        })))
      });
    } else {
      this.libraryGroup = new FormGroup<OfferLibraryGroup>({
        name: new FormControl(""),
        description: new FormControl(""),
        entries: new FormArray([])
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  subscription = {
    next: () => {
      this.dialogRef.close();
    },
    error: (error: any) => {
      this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSubmitClick() {
    this.loadingSubject.next(true);
    if (this.libraryId) {
      this.offerService.patchOfferLibraryOfferV2LibraryLibraryIdPost(this.libraryId, {
        description: this.libraryGroup.get("description").value,
        name: this.libraryGroup.get("name").value
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      this.offerService.createOfferLibraryOfferV2LibraryPut({
        description: this.libraryGroup.get("description").value,
        name: this.libraryGroup.get("name").value
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  onDelete() {
    if (this.libraryId) {
      this.offerService.deleteOfferLibraryOfferV2LibraryLibraryIdDelete(this.libraryId).pipe(take(1)).subscribe(this.subscription);
    }
  }
}

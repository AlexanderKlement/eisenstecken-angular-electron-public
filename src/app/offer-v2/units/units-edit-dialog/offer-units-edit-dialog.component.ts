import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { OfferUnit, OfferV2Service } from "../../../../api/openapi";
import { BehaviorSubject } from "rxjs";
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

export interface OfferUnitsEditData {
  unit?: OfferUnit;
}

type OfferUnitGroup = {
  short: FormControl<string>;
  name: FormControl<string>;
}

@Component({
  selector: "offer-units-edit-dialog",
  templateUrl: "./offer-units-edit-dialog.component.html",
  styleUrls: ["./offer-units-edit-dialog.component.scss"],
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
export default class OfferUnitsEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<OfferUnitsEditDialogComponent>>(MatDialogRef);
  data = inject<OfferUnitsEditData>(MAT_DIALOG_DATA);
  private offerService = inject(OfferV2Service);
  unitsGroup: FormGroup<OfferUnitGroup>;
  unitId: number;
  title = "Einheiten";
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    if (this.data?.unit) {
      this.unitId = this.data.unit.id;
      this.title = "Einheit bearbeiten";
    } else {
      this.title = "Neue Einheit erstellen";
    }
    this.initData();
  }

  initData(): void {
    if (this.data.unit) {
      this.unitsGroup = new FormGroup<OfferUnitGroup>({
        short: new FormControl(this.data.unit.short),
        name: new FormControl(this.data.unit.name)
      });
    } else {
      this.unitsGroup = new FormGroup<OfferUnitGroup>({
        short: new FormControl(""),
        name: new FormControl("")
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  subscription = {
    next: () => {
      this.dialogRef.close(true);
    },
    error: (error: any) => {
      this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSubmitClick() {
    this.loadingSubject.next(true);
    if (this.unitId) {
      this.offerService.patchOfferUnitOfferV2UnitUnitIdPost(this.unitId, {
        short: this.unitsGroup.get("short").value,
        name: this.unitsGroup.get("name").value
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      this.offerService.createOfferUnitOfferV2UnitPut({
        short: this.unitsGroup.get("short").value,
        name: this.unitsGroup.get("name").value
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  onDelete() {
    if (this.unitId) {
      this.offerService.deleteOfferUnitOfferV2UnitUnitIdDelete(this.unitId).pipe(take(1)).subscribe(this.subscription);
    }
  }
}

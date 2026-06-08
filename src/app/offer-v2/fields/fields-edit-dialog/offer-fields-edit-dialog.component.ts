import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { OfferField, OfferFieldEnum, OfferUnit, OfferV2Service, ScopeEnum } from "../../../../api/openapi";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { fieldTypeToString } from "../../offer.util";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import OfferCalculationInputComponent from "../../calculation-input/offer-calculation-input.component";

export interface OfferFieldsEditData {
  field?: OfferField;
}

type OfferFieldGroup = {
  label: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<string>;
  calculation: FormControl<string>;
  unitId: FormControl<string>;
}

@Component({
  selector: "offer-fields-edit-dialog",
  templateUrl: "./offer-fields-edit-dialog.component.html",
  styleUrls: ["./offer-fields-edit-dialog.component.scss"],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    AsyncPipe,
    FlexModule,
    MatButton,
    MatProgressSpinner,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    OfferCalculationInputComponent
  ]
})
export default class OfferFieldsEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<OfferFieldsEditDialogComponent>>(MatDialogRef);
  data = inject<OfferFieldsEditData>(MAT_DIALOG_DATA);
  private offerService = inject(OfferV2Service);
  fieldsGroup: FormGroup<OfferFieldGroup>;
  fieldId: number;
  title = "Felder";
  units$: Observable<OfferUnit[]>;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    if (this.data?.field) {
      this.fieldId = this.data.field.id;
      this.title = "Feld bearbeiten";
    } else {
      this.title = "Neues Feld erstellen";
    }
    this.initData();
    this.units$ = this.offerService.getOfferUnitsOfferV2UnitsGet();
  }

  initData(): void {
    if (this.data.field) {
      this.fieldsGroup = new FormGroup<OfferFieldGroup>({
        label: new FormControl(this.data.field.label),
        type: new FormControl(this.data.field.fieldType),
        calculation: new FormControl(this.data.field.calculation),
        description: new FormControl(this.data.field.description),
        unitId: new FormControl(this.data.field.unit?.id.toString(10))
      });
    } else {
      this.fieldsGroup = new FormGroup<OfferFieldGroup>({
        label: new FormControl(""),
        type: new FormControl(OfferFieldEnum.String),
        calculation: new FormControl(""),
        description: new FormControl(""),
        unitId: new FormControl("-1")
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
    const uid = parseInt(this.fieldsGroup.get("unitId").value);
    if (this.fieldsGroup.valid) {
      this.loadingSubject.next(true);
      if (this.fieldId) {
        this.offerService.patchOfferFieldOfferV2FieldFieldIdPost(this.fieldId, {
          unitId: uid === -1 ? undefined : uid,
          label: this.fieldsGroup.get("label").value,
          calculation: this.fieldsGroup.get("calculation").value,
          description: this.fieldsGroup.get("description").value,
          fieldType: this.fieldsGroup.get("type").value as OfferFieldEnum
        }).pipe(take(1)).subscribe(this.subscription);
      } else {
        this.offerService.createOfferFieldOfferV2FieldPut({
          unitId: uid === -1 ? undefined : uid,
          label: this.fieldsGroup.get("label").value,
          calculation: this.fieldsGroup.get("calculation").value,
          description: this.fieldsGroup.get("description").value,
          fieldType: this.fieldsGroup.get("type").value as OfferFieldEnum
        }).pipe(take(1)).subscribe(this.subscription);
      }
    }
  }

  onDelete() {
    if (this.fieldId) {
      this.offerService.deleteOfferFieldOfferV2FieldFieldIdDelete(this.fieldId).pipe(take(1)).subscribe(this.subscription);
    }
  }

  setCalculation(val: string) {
    this.fieldsGroup.patchValue({ calculation: val });
  }

  protected readonly ScopeEnum = ScopeEnum;
  protected readonly OfferFieldEnum = OfferFieldEnum;
  protected readonly fieldTypeToString = fieldTypeToString;
}

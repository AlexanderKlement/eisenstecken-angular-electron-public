import { Component, inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../../shared/components/toolbar/toolbar.component";
import { OfferFieldEnum, OfferService } from "../../../../api/openapi/api/offer.service";
import {
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatHint, MatInput, MatLabel } from "@angular/material/input";
import { DefaultService, ScopeEnum, Unit } from "../../../../api/openapi";
import { MatOption } from "@angular/material/core";
import { MatSelect } from "@angular/material/select";
import { BehaviorSubject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { ActivatedRoute, Router } from "@angular/router";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { fieldTypeToString } from "../../offer.util";

type OfferFieldGroup = {
  label: FormControl<string>;
  description: FormControl<string>;
  type: FormControl<string>;
  calculation: FormControl<string>;
  unitId: FormControl<string>;
}

@Component({
  selector: "app-offer-edit-fields",
  templateUrl: "./offer-fields-edit.component.html",
  styleUrls: ["./offer-fields-edit.component.scss"],
  imports: [
    ToolbarComponent,
    ReactiveFormsModule,
    FormsModule,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatHint,
    MatLabel,
    MatOption,
    MatSelect,
    AsyncPipe,
    FlexModule,
    MatButton,
    MatProgressSpinner
  ]
})
export default class OfferFieldsEditComponent implements OnInit {
  private api = inject(DefaultService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private offerService = inject(OfferService);
  fieldsGroup: FormGroup<OfferFieldGroup>;
  fieldId: number;
  title = "Felder";
  title2 = "Felder";
  buttons = [];
  units: Observable<Unit[]>;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      let id = parseInt(params.id, 10);
      if (!Number.isNaN(id)) {
        this.fieldId = id;
        this.title2 = "Feld bearbeiten";
      } else {
        this.title2 = "Neues Feld erstellen";
      }
      this.initData();
    });
    this.units = this.api.readUnitsUnitGet();
  }

  initData(): void {
    if (this.fieldId) {
      this.offerService.getField(this.fieldId).subscribe({
        next: data => {
          this.fieldsGroup = new FormGroup<OfferFieldGroup>({
            label: new FormControl(data.label),
            type: new FormControl(data.type),
            calculation: new FormControl(data.calculation),
            description: new FormControl(data.description),
            unitId: new FormControl(data.unitId.toString(10))
          });
        }
      });
    } else {
      this.fieldsGroup = new FormGroup<OfferFieldGroup>({
        label: new FormControl(""),
        type: new FormControl(OfferFieldEnum.Alphanumeric),
        calculation: new FormControl(""),
        description: new FormControl(""),
        unitId: new FormControl("-1")
      });
    }
  }

  onSubmit() {
    const uid = parseInt(this.fieldsGroup.get("unitId").value);
    this.loadingSubject.next(true);
    if (this.fieldId) {
      this.offerService.patchField(this.fieldId, {
        unitId: uid === -1 ? undefined : uid,
        label: this.fieldsGroup.get("label").value,
        calculation: this.fieldsGroup.get("calculation").value,
        description: this.fieldsGroup.get("description").value
      }).subscribe({
        next: () => {
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/test/fields").then();
        }
      });
    } else {
      this.offerService.createField({
        unitId: uid === -1 ? undefined : uid,
        label: this.fieldsGroup.get("label").value,
        calculation: this.fieldsGroup.get("calculation").value,
        description: this.fieldsGroup.get("description").value,
        type: this.fieldsGroup.get("type").value as OfferFieldEnum
      }).subscribe({
        next: () => {
          this.loadingSubject.next(false);
          this.router.navigateByUrl("/test/fields").then();
        }
      });
    }
  }

  onDelete() {
    // TODO
  }

  protected readonly ScopeEnum = ScopeEnum;
  protected readonly OfferFieldEnum = OfferFieldEnum;
  protected readonly fieldTypeToString = fieldTypeToString;
}

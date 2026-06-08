import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import OfferContainerComponent from "../../offer-container/offer-container.component";
import { OfferField, OfferFieldEnum, OfferV2Service } from "../../../../api/openapi";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { fieldTypeToColor, fieldTypeToString, fieldTypeToTextColor } from "../../offer.util";
import OfferFieldsComponent from "../../fields/offer-fields.component";

type ElementTypeGroup = {
  name: FormControl<string>;
}

@Component({
  selector: "app-offer-element-types-edit",
  templateUrl: "./offer-element-types-edit.component.html",
  styleUrls: ["./offer-element-types-edit.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent,
    DefaultFlexDirective,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    MatButton,
    MatIcon,
    MatSuffix
  ]
})
export default class OfferElementTypesEditComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferV2Service);
  subTitle = "";
  elementTypeId: number;
  private snackBar = inject(MatSnackBar);
  elementTypeGroup: FormGroup<ElementTypeGroup>;
  fields: OfferField[];
  selectedFields: OfferField[];
  descField: OfferField;
  offertextField: OfferField;
  dialogOpen = false;
  @ViewChild("search") searchInput: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.elementTypeId = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData();
    });
    this.offerService.getOfferFieldsOfferV2FieldsGet().pipe(take(1)).subscribe({
      next: (result) => {
        this.fields = result;
        this.descField = result.find(f => f.id === 1);
        this.offertextField = result.find(f => f.id === 2);
      },
      error: error => {
        this.snackBar.open("Ein unerwarteter Fehler ist Aufgetreten: " + error, "Ok", { duration: 8000 });

      }
    });
  }

  initData() {
    if (this.elementTypeId) {
      this.offerService.getOfferElementTypeOfferV2ElementTypeElementTypeIdGet(this.elementTypeId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.elementTypeGroup = new FormGroup({
              name: new FormControl(data.name)
            });
            this.selectedFields = data.fields;
          },
          error: error => {
            this.snackBar.open("Der Elementtyp konnte nicht gefunden werden: " + error, "Ok", { duration: 8000 });
            this.elementTypeId = undefined;
            this.initData();
          }
        }
      );
      this.subTitle = "Elementtyp bearbeiten";
    } else {
      this.subTitle = "Elementtyp erstellen";
      this.elementTypeGroup = new FormGroup({
        name: new FormControl("")
      });
      this.selectedFields = [];
    }
  }

  openFieldsDialog() {
    this.dialogOpen = true;
  }

  closeFieldsDialog() {
    this.dialogOpen = false;
  }

  onDelete() {
    // TODO
  }

  onSave() {
    // TODO
  }

  protected onAddField(field: OfferField) {
    this.selectedFields.push(field);
    this.closeFieldsDialog();
  }

  protected readonly fieldTypeToString = fieldTypeToString;
  protected readonly OfferFieldsComponent = OfferFieldsComponent;
  protected readonly OfferFieldEnum = OfferFieldEnum;
  protected readonly fieldTypeToColor = fieldTypeToColor;
  protected readonly fieldTypeToTextColor = fieldTypeToTextColor;

}

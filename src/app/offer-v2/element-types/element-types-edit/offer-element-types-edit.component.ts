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
import OfferFieldsComponent from "../../fields/offer-fields.component";
import { ListElementComponent } from "../../../shared/components/list-element/list-element.component";
import {
  OfferFieldElementTypePillComponent
} from "../../offer-field-element-type-pill/offer-field-element-type-pill.component";
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from "@angular/cdk/drag-drop";
import OfferCalculationInputComponent from "../../calculation-input/offer-calculation-input.component";
import { MatDialog } from "@angular/material/dialog";
import { AsyncPipe } from "@angular/common";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { BehaviorSubject } from "rxjs";
import { confirmDeleteDialog } from "../../offer.util";

type ElementTypeGroup = {
  name: FormControl<string>;
  price: FormControl<string>;
  offertext: FormControl<string>;
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
    MatSuffix,
    ListElementComponent,
    OfferFieldElementTypePillComponent,
    CdkDropList,
    CdkDrag,
    OfferCalculationInputComponent,
    AsyncPipe,
    MatProgressSpinner
  ]
})
export default class OfferElementTypesEditComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private offerService = inject(OfferV2Service);
  subTitle = "Elementtyp erstellen";
  elementTypeId: number;
  private snackBar = inject(MatSnackBar);
  elementTypeGroup: FormGroup<ElementTypeGroup> = new FormGroup({
    name: new FormControl(""),
    price: new FormControl(""),
    offertext: new FormControl("")
  });
  fields: OfferField[] = [];
  displayFields: OfferField[] = [];
  selectedFields: OfferField[] = [];
  dialogOpen = false;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  @ViewChild("search") searchInput: ElementRef<HTMLInputElement>;
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.elementTypeId = parseInt(params.id, 10);
      } catch {
        // is createMode
      }
      this.initData(params.method);
    });
    this.offerService.getOfferFieldsOfferV2FieldsGet().pipe(take(1)).subscribe({
      next: (result) => {
        this.fields = result;
        this.displayFields = result.filter(this.fieldsFilter.bind(this));
      },
      error: error => {
        this.snackBar.open("Ein unerwarteter Fehler ist Aufgetreten: " + error, "Ok", { duration: 8000 });

      }
    });
  }

  initData(method?: string) {
    if (this.elementTypeId) {
      this.offerService.getOfferElementTypeOfferV2ElementTypeElementTypeIdGet(this.elementTypeId).pipe(take(1)).subscribe(
        {
          next: data => {
            this.elementTypeGroup = new FormGroup({
              name: new FormControl(data.name),
              price: new FormControl(data.price ?? ""),
              offertext: new FormControl(data.offertext ?? "")
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
      if (method === "copy") {
        this.elementTypeId = undefined;
        this.subTitle = "Elementtyp erstellen";
      } else if (method === "delete") {
        this.onDelete();
      }
    } else {
      this.subTitle = "Elementtyp erstellen";
    }
  }

  fieldsFilter(f: OfferField) {
    return f.visible && !this.selectedFields.find(selF => selF.id === f.id);
  }

  onSearchField() {
    const key = this.searchInput.nativeElement.value.toLowerCase();
    if (key.length > 0) {
      this.displayFields = this.fields.filter(f => this.fieldsFilter(f) && (f.label.toLowerCase().includes(key) || f.description.toLowerCase().includes(key)));
    } else {
      this.displayFields = this.fields.filter(this.fieldsFilter.bind(this));
    }
  }

  openFieldsDialog() {
    this.dialogOpen = true;
  }

  closeFieldsDialog() {
    this.dialogOpen = false;
  }

  onDelete() {
    if (this.elementTypeId) {
      this.loadingSubject.next(true);
      confirmDeleteDialog(this.elementTypeId, this.dialog, "Elementtyp", this.offerService.deleteOfferElementTypeOfferV2ElementTypeElementTypeIdDelete,
        {
          loadData: this.subscription.next
        }, this.snackBar);
    }
  }

  onSave() {
    this.loadingSubject.next(true);
    if (this.elementTypeId) {
      this.offerService.patchOfferElementTypeOfferV2ElementTypeElementTypeIdPost(this.elementTypeId, {
        name: this.elementTypeGroup.get("name").value,
        fieldIds: this.selectedFields.map(f => f.id),
        offertext: this.elementTypeGroup.get("offertext").value ?? "",
        price: this.elementTypeGroup.get("price").value ?? ""
      }).pipe(take(1)).subscribe(this.subscription);
    } else {
      this.offerService.createOfferElementTypeOfferV2ElementTypePut({
        name: this.elementTypeGroup.get("name").value,
        fieldIds: this.selectedFields.map(f => f.id),
        offertext: this.elementTypeGroup.get("offertext").value ?? "",
        price: this.elementTypeGroup.get("price").value ?? ""
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }

  subscription = {
    next: () => {
      this.loadingSubject.next(false);
      this.router.navigateByUrl("/offer_v2/element_types").then();
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSetPrice(val: string) {
    this.elementTypeGroup.patchValue({ price: val });
  }

  onSetOffertext(val: string) {
    this.elementTypeGroup.patchValue({ offertext: val });
  }

  onNavCreateField() {
    this.router.navigateByUrl("/offer_v2/fields").then();
  }

  onRemoveField(field: OfferField) {
    this.selectedFields = this.selectedFields.filter(f => f.id !== field.id);
  }

  protected onAddField(field: OfferField) {
    this.selectedFields.push(field);
    this.closeFieldsDialog();
  }

  protected onDrop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.selectedFields, $event.previousIndex, $event.currentIndex);
  }

  protected readonly OfferFieldsComponent = OfferFieldsComponent;
  protected readonly OfferFieldEnum = OfferFieldEnum;

  protected readonly OfferFieldTypePillComponent = OfferFieldElementTypePillComponent;

}

import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { fieldTypeToString } from "../offer.util";
import { OfferField, OfferV2Service } from "../../../api/openapi";
import { MatDialog } from "@angular/material/dialog";
import OfferFieldsEditDialogComponent from "./fields-edit-dialog/offer-fields-edit-dialog.component";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import OfferContainerComponent from "../offer-container/offer-container.component";


@Component({
  selector: "app-offer-fields",
  templateUrl: "./offer-fields.component.html",
  styleUrls: ["./offer-fields.component.scss"],
  imports: [
    ReactiveFormsModule,
    TableBuilderComponent,
    OfferContainerComponent
  ]
})
export default class OfferFieldsComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);

  private dialog = inject(MatDialog);

  fieldsButtons: TableButton[] = [];
  fieldsHeaderButtons: TableButton[] = [];
  fieldsDataSource: TableDataSource<OfferField, OfferV2Service>;
  private snackBar = inject(MatSnackBar);
  editSubscription = {
    next: (field: OfferField) => {
      this.openEditDialog(field);
    },
    error: (error: any) => {
      this.snackBar.open("Feld nicht gefunden: " + error, "Ok", { duration: 8000 });
    }
  };

  ngOnInit(): void {
    this.fieldsButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.deleteOfferFieldOfferV2FieldFieldIdDelete(id).pipe(take(1)).subscribe({
          next: () => {
            this.fieldsDataSource.loadData();
          },
          error: (error) => {
            this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
          }
        });
      },
      class: () => ""
    });
    this.fieldsHeaderButtons.push({
      name: () => "Neues Feld erstellen",
      color: () => "primary",
      selectedField: "",
      navigate: () => {
        this.openEditDialog();
      },
      class: () => ""
    });
    this.fieldsDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferFieldsOfferV2FieldsGet(skip, filter, limit),
      (fields) => {
        const rows = [];
        fields.forEach((field) => {
          if (field.visible)
            rows.push({
              values: {
                id: field.id,
                name: field.label,
                description: field.description,
                type: fieldTypeToString(field.fieldType),
                unit: field.unit ? field.unit.short : " - "
              },
              route: () => {
                this.offerService.getOfferFieldOfferV2FieldFieldIdGet(field.id).pipe(take(1)).subscribe(this.editSubscription);
              }
            });
        });
        return rows;
      }, [
        {
          name: "name",
          headerName: "Bezeichnung",
          sortable: true
        }, {
          name: "description",
          headerName: "Beschreibung",
          sortable: true
        },
        {
          name: "type",
          headerName: "Datentyp",
          sortable: true
        },
        {
          name: "unit",
          headerName: "Einheit",
          sortable: true
        }
      ],
      (api) => api.countOfferFieldsOfferV2CountFieldsGet()
    );
    this.fieldsDataSource.loadData();
  }

  openEditDialog(field?: OfferField) {
    const dialogRef = this.dialog.open(OfferFieldsEditDialogComponent, {
      width: "1000px",
      data: { field }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fieldsDataSource.loadData();
      }
    });
  }

}

import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { fieldTypeToString, headerNewButton, listDeleteButton, listEditButton } from "../offer.util";
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
    this.fieldsButtons.push(listEditButton((id) => {
      this.offerService.getOfferFieldOfferV2FieldFieldIdGet(id).pipe(take(1)).subscribe(this.editSubscription);
    }));
    this.fieldsButtons.push(
      listDeleteButton(
        this.dialog,
        "Feld",
        this.offerService.deleteOfferFieldOfferV2FieldFieldIdDelete,
        this.fieldsDataSource,
        this.snackBar)
    );

    this.fieldsHeaderButtons.push(headerNewButton("Neues Feld erstellen", this.openEditDialog.bind(this)));
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
                // noop
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

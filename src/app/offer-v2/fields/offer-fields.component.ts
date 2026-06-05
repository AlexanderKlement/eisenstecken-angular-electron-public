import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { fieldTypeToString } from "../offer.util";
import { OfferField, OfferV2Service } from "../../../api/openapi";
import { MatDialog } from "@angular/material/dialog";
import OfferFieldsEditDialogComponent from "./fields-edit-dialog/offer-fields-edit-dialog.component";
import { take } from "rxjs/operators";


@Component({
  selector: "app-offer-fields",
  templateUrl: "./offer-fields.component.html",
  styleUrls: ["./offer-fields.component.scss"],
  imports: [
    ToolbarComponent,
    ReactiveFormsModule,
    TableBuilderComponent
  ]
})
export default class OfferFieldsComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);

  private dialog = inject(MatDialog);

  fieldsTitle = "Alle Felder";
  fieldsButtons: TableButton[] = [];
  fieldsHeaderButtons: TableButton[] = [];
  fieldsDataSource: TableDataSource<OfferField, OfferV2Service>;
  private fieldsVar: OfferField[] = [];
  title = "Felder";
  buttons = [];

  ngOnInit(): void {
    this.fieldsButtons.push({
      name: () => ({ icon: "edit" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        const f = this.fieldsVar.find((f) => f.id === id);
        if (f)
          this.openEditDialog(f);
      },
      class: () => ""
    });
    this.fieldsButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.deleteOfferFieldOfferV2FieldFieldIdDelete(id).pipe(take(1)).subscribe(() => {
          this.fieldsDataSource.loadData();
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
    this.buttons.push({
      name: "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2").then();
      }
    }, {
      name: "Felder",
      active: true,
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/fields").then();
      }
    }, {
      name: "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/element_types").then();
      }
    }, {
      name: "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    }, {
      name: "Templates",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
    this.fieldsDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferFieldsOfferV2FieldsGet(skip, filter, limit),
      (fields) => {
        const rows = [];
        this.fieldsVar = fields;
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
    dialogRef.afterClosed().subscribe(() => {
      this.fieldsDataSource.loadData();
    });
  }

}

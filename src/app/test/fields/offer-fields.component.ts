import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { OfferField, OfferService } from "../../../api/openapi/api/offer.service";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { fieldTypeToString } from "../offer.util";


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
  private offerService = inject(OfferService);


  fieldsTitle = "Alle Felder";
  fieldsButtons: TableButton[] = [];
  fieldsHeaderButtons: TableButton[] = [];
  fieldsDataSource: TableDataSource<OfferField, OfferService>;

  title = "Felder";
  buttons = [];

  ngOnInit(): void {
    this.fieldsButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        // TODO
      },
      class: () => ""
    });
    this.fieldsHeaderButtons.push({
      name: () => "Neues Feld erstellen",
      color: () => "primary",
      selectedField: "",
      navigate: (_, id) => {
        this.router.navigateByUrl("/test/fields/new").then();
      },
      class: () => ""
    });
    this.buttons.push({
      name: "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/test").then();
      }
    }, {
      name: "Felder",
      active: true,
      navigate: () => {
        this.router.navigateByUrl("/test/fields").then();
      }
    }, {
      name: "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/test/element_types").then();
      }
    }, {
      name: "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/test/libraries").then();
      }
    }, {
      name: "Templates",
      navigate: () => {
        this.router.navigateByUrl("/test/templates").then();
      }
    });
    this.fieldsDataSource = new TableDataSource(
      this.offerService,
      () => this.offerService.getFields(),
      (fields) => {
        const rows = [];
        fields.forEach((field) => {
          if (field.visible)
            rows.push({
              values: {
                name: field.label,
                description: field.description,
                type: fieldTypeToString(field.type),
                unit: field.unitId ? field.unitId : " - "
              },
              route: () => {
                this.router.navigateByUrl("/test/fields/" + field.id).then();
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
      ], () => this.offerService.countFields());
  }

}

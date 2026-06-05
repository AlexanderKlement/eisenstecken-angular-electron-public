import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { OfferElementType, OfferV2Service } from "../../../api/openapi";


@Component({
  selector: "app-offer-element-types",
  templateUrl: "./offer-element-types.component.html",
  styleUrls: ["./offer-element-types.component.scss"],
  imports: [
    ToolbarComponent,
    ReactiveFormsModule,
    TableBuilderComponent
  ]
})
export default class OfferElementTypesComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);

  title = "Elementtypen";
  buttons = [];
  tableButtons: TableButton[] = [];
  headerButtons: TableButton[] = [];
  dataSource: TableDataSource<OfferElementType, OfferV2Service>;

  ngOnInit(): void {
    this.tableButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        // TODO
      },
      class: () => ""
    });
    this.tableButtons.push({
      name: () => ({ icon: "copy" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        // TODO
      },
      class: () => ""
    });
    this.headerButtons.push({
      name: () => "Neuen Typ erstellen",
      color: () => "primary",
      selectedField: "",
      navigate: (_, id) => {
        this.router.navigateByUrl("/offer_v2/element_types/new").then();
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
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/fields").then();
      }
    }, {
      name: "Elementtypen",
      active: true,
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
    this.dataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferElementTypesOfferV2ElementTypesGet(skip, filter, limit),
      (types) => {
        const rows = [];
        types.forEach((type) => {
          rows.push({
            values: {
              name: type.name,
              offertext: type.offertext.label,
              price: type.price.label,
              fields: type.fields.length + " Felder: " + type.fields.slice(0, 3).map(field => field.label).join(", ") + (type.fields.length > 3 ? "..." : "")
            },
            route: () => {
              this.router.navigateByUrl("/offer_v2/element_type/" + type.id).then();
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
          name: "offertext",
          headerName: "Angebotstext",
          sortable: true
        }, {
          name: "price",
          headerName: "Preisberechnung",
          sortable: true
        }, {
          name: "fields",
          headerName: "Felder",
          sortable: true
        }
      ],
      (api) => api.countOfferElementTypesOfferV2CountElementTypesGet());
  }

}

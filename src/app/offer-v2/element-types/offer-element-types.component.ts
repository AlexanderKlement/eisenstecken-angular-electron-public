import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { OfferElementType, OfferV2Service } from "../../../api/openapi";
import OfferContainerComponent from "../offer-container/offer-container.component";


@Component({
  selector: "app-offer-element-types",
  templateUrl: "./offer-element-types.component.html",
  styleUrls: ["./offer-element-types.component.scss"],
  imports: [
    ReactiveFormsModule,
    TableBuilderComponent,
    OfferContainerComponent
  ]
})
export default class OfferElementTypesComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);

  tableButtons: TableButton[] = [];
  headerButtons: TableButton[] = [];
  elementTypesDataSource: TableDataSource<OfferElementType, OfferV2Service>;

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
    this.elementTypesDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferElementTypesOfferV2ElementTypesGet(skip, filter, limit),
      (types) => {
        const rows = [];
        types.forEach((type) => {
          rows.push({
            values: {
              id: type.id,
              name: type.name,
              offertext: type.offertext.label,
              price: type.price.label,
              fields: type.fields.length + " Felder: " + type.fields.slice(0, 3).map(field => field.label).join(", ") + (type.fields.length > 3 ? "..." : "")
            },
            route: () => {
              // TODO
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
    this.elementTypesDataSource.loadData();
  }

}

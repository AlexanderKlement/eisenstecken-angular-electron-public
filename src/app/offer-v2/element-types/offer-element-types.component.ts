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
        this.router.navigateByUrl(`/offer_v2/element_types/${id}/delete`).then();
      },
      class: () => ""
    });
    this.tableButtons.push({
      name: () => ({ icon: "content_copy" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.router.navigateByUrl(`/offer_v2/element_types/${id}/copy`).then();
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
              price: type.price,
              offertext: type.offertext,
              field1: type.fields.at(0)?.label ?? " - ",
              field2: type.fields.at(1)?.label ?? " - ",
              field3: type.fields.at(2)?.label ?? " - ",
              extraFields: type.fields.length > 3 ? `+${type.fields.length - 3}` : " - "
            },
            route: () => {
              this.router.navigateByUrl(`/offer_v2/element_types/${type.id}`).then();
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
          name: "price",
          headerName: "Preisberechnung"
        }, {
          name: "offertext",
          headerName: "Angebotstext"
        }, {
          name: "field1",
          headerName: "Feld 1"
        }, {
          name: "field2",
          headerName: "Feld 2"
        }, {
          name: "field3",
          headerName: "Feld 3"
        },
        {
          name: "extraFields",
          headerName: "Felder"
        }

      ],
      (api) => api.countOfferElementTypesOfferV2CountElementTypesGet());
    this.elementTypesDataSource.loadData();
  }

}

import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { OfferElementType, OfferService } from "../../../api/openapi/api/offer.service";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";


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
  private offerService = inject(OfferService);

  title = "Elementtypen";
  buttons = [];
  tableButtons: TableButton[] = [];
  headerButtons: TableButton[] = [];
  dataSource: TableDataSource<OfferElementType, OfferService>;

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
        this.router.navigateByUrl("/test/element_types/new").then();
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
      navigate: () => {
        this.router.navigateByUrl("/test/fields").then();
      }
    }, {
      name: "Elementtypen",
      active: true,
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
    this.dataSource = new TableDataSource(
      this.offerService,
      () => this.offerService.getElementTypes(),
      (types) => {
        const rows = [];
        types.forEach((type) => {
          rows.push({
            values: {
              name: type.title,
              offertext: type.offertext.defaultValue,
              price: type.price.defaultValue,
              fields: type.fields.length + " Felder: " + type.fields.slice(0, 3).map(field => field.label).join(", ") + (type.fields.length > 3 ? "..." : "")
            },
            route: () => {
              this.router.navigateByUrl("/test/element_type/" + type.id).then();
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
      ], () => this.offerService.countElementTypes());
  }

}

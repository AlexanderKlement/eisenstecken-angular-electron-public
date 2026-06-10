import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { OfferTemplateListElement, OfferV2Service } from "../../../api/openapi";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { headerNewButton, listDeleteButton, listEditButton } from "../offer.util";


@Component({
  selector: "app-offer-templates",
  templateUrl: "./offer-templates.component.html",
  styleUrls: ["./offer-templates.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent,
    TableBuilderComponent
  ]
})
export default class OfferTemplatesComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tableButtons: TableButton[] = [];
  headerButtons: TableButton[] = [];
  templateDataSource: TableDataSource<OfferTemplateListElement, OfferV2Service>;

  ngOnInit(): void {
    this.tableButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/templates/${id}`).then();
    }));
    this.tableButtons.push(listDeleteButton(this.dialog, "Template", this.offerService.deleteOfferTemplateOfferV2TemplateTemplateIdDelete, this.templateDataSource, this.snackBar));
    this.tableButtons.push({
      name: () => ({ icon: "content_copy" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.router.navigateByUrl(`/offer_v2/templates/${id}/copy`).then();
      },
      class: () => ""
    });
    this.headerButtons.push(headerNewButton("Neues Template erstellen", () => {
      this.router.navigateByUrl("/offer_v2/templates/new").then();
    }));

    this.templateDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferTemplatesOfferV2TemplatesGet(skip, filter, limit),
      (templates) => {
        const rows = [];
        templates.forEach((template) => {
          rows.push({
            values: {
              id: template.id,
              name: template.name,
              description: template.description,
              entry_count: template.entry_count
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
          headerName: "Name",
          sortable: true
        }, {
          name: "description",
          headerName: "Beschreibung"
        }, {
          name: "entry_count",
          headerName: "Elemente"
        }

      ],
      (api) => api.countOfferTemplatesOfferV2CountTemplatesGet());
    this.templateDataSource.loadData();
  }

}

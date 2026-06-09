import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { OfferElementListElement, OfferV2Service } from "../../../api/openapi";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { headerNewButton, listDeleteButton, listEditButton } from "../offer.util";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";


@Component({
  selector: "app-offer-elements",
  templateUrl: "./offer-elements.component.html",
  styleUrls: ["./offer-elements.component.scss"],
  imports: [
    ReactiveFormsModule,
    TableBuilderComponent,
    OfferContainerComponent
  ]
})
export default class OfferElementsComponent implements OnInit {

  private router = inject(Router);
  private offerService = inject(OfferV2Service);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  tableButtons: TableButton[] = [];
  headerButtons: TableButton[] = [];
  elementsDataSource: TableDataSource<OfferElementListElement, OfferV2Service>;

  ngOnInit(): void {
    this.tableButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/elements/${id}`).then();
    }));
    this.tableButtons.push(listDeleteButton(this.dialog, "Element", this.offerService.deleteOfferElementOfferV2ElementElementIdDelete, this.elementsDataSource, this.snackBar));
    this.tableButtons.push({
      name: () => ({ icon: "content_copy" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.router.navigateByUrl(`/offer_v2/elements/${id}/copy`).then();
      },
      class: () => ""
    });
    this.headerButtons.push(headerNewButton("Neues Element erstellen", () => {
      this.router.navigateByUrl("/offer_v2/elements/new").then();
    }));

    this.elementsDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferElementsOfferV2ElementsGet(skip, filter, limit),
      (elements) => {
        const rows = [];
        elements.forEach((element) => {
          rows.push({
            values: {
              id: element.id,
              name: element.name,
              elementType: element.elementType.name
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
          name: "elementType",
          headerName: "Elementtyp"
        }

      ],
      (api) => api.countOfferElementsOfferV2CountElementsGet());
    this.elementsDataSource.loadData();
  }

}

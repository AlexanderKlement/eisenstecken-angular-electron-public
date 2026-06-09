import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OfferV2, OfferV2Service } from "../../api/openapi";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../shared/components/table-builder/table-builder.component";
import OfferContainerComponent from "./offer-container/offer-container.component";
import { headerNewButton, listEditButton } from "./offer.util";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";


@Component({
  selector: "app-offer-v2",
  templateUrl: "./offer-v2.component.html",
  styleUrls: ["./offer-v2.component.scss"],
  imports: [
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    TableBuilderComponent,
    OfferContainerComponent
  ]
})
export default class OfferV2Component implements OnInit {
  private offerService = inject(OfferV2Service);

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  jobId: number | undefined = undefined;
  offerTitle = "Alle Angebote";
  offerDataSource: TableDataSource<OfferV2, OfferV2Service>;
  offerButtons: TableButton[] = [];
  offerHeaderButtons: TableButton[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = parseInt(params.job_id, 10);
      if (!Number.isNaN(id)) {
        this.jobId = id;
        this.offerTitle = "Angebote von " + id;
      }
      this.initTables();
    });
    this.offerHeaderButtons.push(headerNewButton("Neues Angebot erstellen", () => {
      this.router.navigateByUrl("/offer_v2/offer/new").then();
    }));
  }

  initTables(): void {
    this.offerDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOffersOfferV2OffersGet(this.jobId, skip, filter, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              name: dataSource.id.toString(10),
              client: "Job",
              lastChanged: new Date(dataSource.lastChanged).toLocaleString(),
              actions: " - "
            },
            route: () => {
              // noop
            }
          });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Bezeichnung" },
        { name: "client", headerName: "Kunde" },
        { name: "lastChanged", headerName: "Zuletzt geändert" }
      ],
      (api) => api.countOffersOfferV2CountOffersGet(this.jobId)
    );

    this.offerButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/offer/${id}`).then();
    }));
    this.offerDataSource.loadData();
  }
}

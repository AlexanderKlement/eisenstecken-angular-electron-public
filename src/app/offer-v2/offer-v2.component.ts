import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OfferStatement, OfferV2, OfferV2Service } from "../../api/openapi";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../shared/components/table-builder/table-builder.component";
import OfferContainerComponent from "./offer-container/offer-container.component";
import { headerNewButton, listEditButton } from "./offer.util";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDialog } from "@angular/material/dialog";
import { formatCurrency } from "@angular/common";


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
  statementDataSource: TableDataSource<OfferStatement, OfferV2Service>;
  offerButtons: TableButton[] = [];
  statementButtons: TableButton[] = [];
  offerHeaderButtons: TableButton[] = [];
  statementHeaderButtons: TableButton[] = [];

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
    this.statementHeaderButtons.push(headerNewButton("Neue Aufstellung erstellen", () => {
      this.router.navigateByUrl("/offer_v2/statement/new").then();
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
              id: dataSource.id,
              name: dataSource.name,
              job: dataSource.job.name,
              client: dataSource.job.client.fullname,
              lastChanged: new Date(dataSource.lastChanged).toLocaleString()
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
        { name: "job", headerName: "Auftrag" },
        { name: "client", headerName: "Kunde" },
        { name: "lastChanged", headerName: "Zuletzt geändert" }
      ],
      (api) => api.countOffersOfferV2CountOffersGet(this.jobId)
    );

    this.offerButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/offer/${id}`).then();
    }));
    this.offerDataSource.loadData();
    this.statementDataSource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getStatementsOfferV2StatementsGet(this.jobId, skip, filter, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              id: dataSource.id,
              name: dataSource.name,
              job: dataSource.offer.name,
              client: dataSource.offer.job.client.fullname,
              originalPrice: formatCurrency(dataSource.originalPrice, "de-DE", "€"),
              price: formatCurrency(dataSource.price, "de-DE", "€")
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
        { name: "job", headerName: "Auftrag" },
        { name: "client", headerName: "Kunde" },
        { name: "originalPrice", headerName: "Originalpreis" },
        { name: "price", headerName: "Neuer Preis" }
      ],
      (api) => api.countStatementsOfferV2CountStatementsGet(this.jobId)
    );

    this.statementButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/statement/${id}`).then();
    }));
    this.statementDataSource.loadData();

  }
}

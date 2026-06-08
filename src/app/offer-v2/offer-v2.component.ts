import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { OfferV2, OfferV2Service } from "../../api/openapi";
import { ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../shared/components/table-builder/table-builder.component";


@Component({
  selector: "app-offer-v2",
  templateUrl: "./offer-v2.component.html",
  styleUrls: ["./offer-v2.component.scss"],
  imports: [
    ToolbarComponent,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    TableBuilderComponent
  ]
})
export default class OfferV2Component implements OnInit {
  private api = inject(OfferV2Service);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobId: number | undefined = undefined;
  title = "Angebote";
  offerTitle = "Alle Angebote";
  buttons = [];
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
    this.offerHeaderButtons.push({
      name: () => "Neues Angebot erstellen",
      color: () => "primary",
      class: () => "",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/offer/new").then();
      },
      selectedField: ""
    });
    this.buttons.push({
      name: "Angebote",
      active: true,
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
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/element_types").then();
      }
    }, {
      name: "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    }, {
      name: "Einheiten",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/units").then();
      }
    }, {
      name: "Templates",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
  }

  initTables(): void {
    this.offerDataSource = new TableDataSource(
      this.api,
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
              this.router.navigateByUrl(`/offer_v2/offer/${dataSource.id}`).then();
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

    this.offerButtons.push({
      name: () => ({
        icon: "edit"
      }),
      color: () => "accent",
      navigate: (_, id) => {
        this.router.navigateByUrl(`/offer_v2/offer/${id}`).then();
      },
      class: () => "",
      selectedField: "name"
    }, {
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      navigate: () => {
        //TODO
      },
      class: () => "",
      selectedField: "name"
    });
    this.offerDataSource.loadData();
  }

  onNewOffer() {
    // nothing
  }
}

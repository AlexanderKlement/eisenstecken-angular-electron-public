import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DefaultService, Offer, ScopeEnum } from "../../api/openapi";
import { ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../shared/components/table-builder/table-builder.datasource";
import { first } from "rxjs/operators";
import { AuthStateService } from "../shared/services/auth-state.service";
import { LockService } from "../shared/services/lock.service";
import { TableBuilderComponent, TableButton } from "../shared/components/table-builder/table-builder.component";


@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",
  styleUrls: ["./test.component.scss"],
  imports: [
    ToolbarComponent,
    MatTab,
    MatTabGroup,
    ReactiveFormsModule,
    TableBuilderComponent
  ]
})
export default class TestComponent implements OnInit {
  private api = inject(DefaultService);
  private authService = inject(AuthStateService);
  private locker = inject(LockService);

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  jobId: number = 3595;
  title = "Angebote";
  offerTitle = "Alle Angebote";
  buttons = [];
  offerDataSource: TableDataSource<Offer, DefaultService>;
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
        this.router.navigateByUrl("/test/offer/new").then();
      },
      selectedField: ""
    });
    this.buttons.push({
      name: "Angebote",
      active: true,
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
  }

  initTables(): void {
    this.offerDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOffersByJobOfferJobJobIdGet(this.jobId, filter, skip, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              name: dataSource.id.toString(10),
              client: "Job",
              last_changed: new Date(dataSource.date).toLocaleString(),
              actions: " - "
            },
            route: () => {
              this.authService
                .currentUserHasScope(ScopeEnum.Office)
                .pipe(first())
                .subscribe((allowed) => {
                  if (allowed) {
                    this.locker.getLockAndTryNavigate(
                      this.api.islockedOfferOfferIslockedOfferIdGet(
                        dataSource.id
                      ),
                      this.api.lockOfferOfferLockOfferIdPost(dataSource.id),
                      this.api.lockOfferOfferUnlockOfferIdPost(dataSource.id),
                      "test/offer/" + dataSource.id.toString()
                    );
                  }
                });
            }
          });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Bezeichnung" },
        { name: "client", headerName: "Kunde" },
        { name: "last_changed", headerName: "Zuletzt geändert" }
      ],
      (api) => api.countOffersByJobOfferJobCountJobIdGet(this.jobId)
    );

    this.offerButtons.push({
      name: () => ({
        icon: "edit"
      }),
      color: () => "accent",
      navigate: (_, id) => {
        this.router.navigateByUrl(`/test/offer/${id}`).then();
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

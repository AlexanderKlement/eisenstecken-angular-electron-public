import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { OfferLibraryListElement, OfferV2Service } from "../../../api/openapi";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { MatDialog } from "@angular/material/dialog";

import { MatSnackBar } from "@angular/material/snack-bar";
import { headerNewButton, listDeleteButton, listEditButton } from "../offer.util";
import { Router } from "@angular/router";


@Component({
  selector: "app-offer-libraries",
  templateUrl: "./offer-libraries.component.html",
  styleUrls: ["./offer-libraries.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent,
    TableBuilderComponent
  ]
})
export default class OfferLibrariesComponent implements OnInit {
  private offerService = inject(OfferV2Service);
  private router = inject(Router);
  librariesHeaderButtons: TableButton[] = [];
  librariesButtons: TableButton[] = [];
  librariesDataSource: TableDataSource<OfferLibraryListElement, OfferV2Service>;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  ngOnInit(): void {
    this.librariesButtons.push(listEditButton((id) => {
      this.router.navigateByUrl(`/offer_v2/libraries/${id}`);
    }));
    this.librariesButtons.push(
      listDeleteButton(
        this.dialog,
        "Bibliothek",
        this.offerService.deleteOfferLibraryOfferV2LibraryLibraryIdDelete,
        this.librariesDataSource,
        this.snackBar)
    );
    this.librariesHeaderButtons.push(headerNewButton("Neue Bibliothek erstellen", () => {
      this.router.navigateByUrl(`/offer_v2/libraries/new`);
    }));
    this.librariesDataSource = new TableDataSource<OfferLibraryListElement, OfferV2Service>(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferLibrariesOfferV2LibrariesGet(skip, filter, limit),
      (libraries) => {
        const rows = [];
        libraries.forEach((library) => {
          rows.push({
            values: {
              id: library.id,
              name: library.name,
              description: library.description,
              entries: library.entry_count
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
          name: "description",
          headerName: "Beschreibung",
          sortable: true
        }, {
          name: "entries",
          headerName: "Anzahl Elemente",
          sortable: true
        }
      ],
      (api) => api.countOfferLibrariesOfferV2CountLibrariesGet());
    this.librariesDataSource.loadData();
  }

}

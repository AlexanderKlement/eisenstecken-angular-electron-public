import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { OfferLibrary, OfferLibraryListElement, OfferV2Service } from "../../../api/openapi";
import OfferContainerComponent from "../offer-container/offer-container.component";
import { MatDialog } from "@angular/material/dialog";
import OfferLibraryEditDialogComponent from "./library-edit-dialog/offer-library-edit-dialog.component";
import { take } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";


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

  librariesHeaderButtons: TableButton[] = [];
  librariesButtons: TableButton[] = [];
  librariesDataSource: TableDataSource<OfferLibraryListElement, OfferV2Service>;
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  editSubscription = {
    next: (library: OfferLibrary) => {
      this.openEditDialog(library);
    },
    error: (error: any) => {
      this.snackBar.open("Bibliothek nicht gefunden: " + error, "Ok", { duration: 8000 });
    }
  };

  ngOnInit(): void {
    this.librariesButtons.push({
      name: () => ({ icon: "edit" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.getOfferLibraryOfferV2LibraryLibraryIdGet(id).pipe(take(1)).subscribe(this.editSubscription);
      },
      class: () => ""
    });
    this.librariesButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.deleteOfferUnitOfferV2UnitUnitIdDelete(id).pipe(take(1)).subscribe({
          next: () => {
            this.librariesDataSource.loadData();
          },
          error: (error) => {
            this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
          }
        });
      },
      class: () => ""
    });
    this.librariesHeaderButtons.push({
      name: () => "Neue Bibliothek erstellen",
      color: () => "primary",
      selectedField: "",
      navigate: () => {
        this.openEditDialog();
      },
      class: () => ""
    });
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


  openEditDialog(library?: OfferLibrary) {
    const dialogRef = this.dialog.open(OfferLibraryEditDialogComponent, {
      width: "1000px",
      data: { library }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.librariesDataSource.loadData();
    });
  }

}

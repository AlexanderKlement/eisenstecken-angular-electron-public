import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { TableBuilderComponent, TableButton } from "../../shared/components/table-builder/table-builder.component";
import { OfferUnit, OfferV2Service } from "../../../api/openapi";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs/operators";
import OfferUnitsEditDialogComponent from "./units-edit-dialog/offer-units-edit-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import OfferContainerComponent from "../offer-container/offer-container.component";


@Component({
  selector: "app-offer-units",
  templateUrl: "./offer-units.component.html",
  styleUrls: ["./offer-units.component.scss"],
  imports: [
    ReactiveFormsModule,
    TableBuilderComponent,
    OfferContainerComponent
  ]
})
export default class OfferUnitsComponent implements OnInit {

  private offerService = inject(OfferV2Service);

  private dialog = inject(MatDialog);

  unitsButtons: TableButton[] = [];
  unitsHeaderButtons: TableButton[] = [];
  unitsDatasource: TableDataSource<OfferUnit, OfferV2Service>;
  private snackBar = inject(MatSnackBar);
  editSubscription = {
    next: (unit: OfferUnit) => {
      this.openEditDialog(unit);
    },
    error: (error: any) => {
      this.snackBar.open("Einheit nicht gefunden: " + error, "Ok", { duration: 8000 });
    }
  };

  ngOnInit(): void {
    this.unitsButtons.push({
      name: () => ({ icon: "edit" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.getOfferUnitOfferV2UnitUnitIdGet(id).pipe(take(1)).subscribe(this.editSubscription);
      },
      class: () => ""
    });
    this.unitsButtons.push({
      name: () => ({ icon: "delete" }),
      color: () => "accent",
      selectedField: "",
      navigate: (_, id) => {
        this.offerService.deleteOfferUnitOfferV2UnitUnitIdDelete(id).pipe(take(1)).subscribe({
          next: () => {
            this.unitsDatasource.loadData();
          },
          error: (error) => {
            this.snackBar.open("Löschen fehlgeschlagen: " + error, "Ok", { duration: 8000 });
          }
        });
      },
      class: () => ""
    });
    this.unitsHeaderButtons.push({
      name: () => "Neue Einheit erstellen",
      color: () => "primary",
      selectedField: "",
      navigate: () => {
        this.openEditDialog();
      },
      class: () => ""
    });
    this.unitsDatasource = new TableDataSource(
      this.offerService,
      (api, filter, sortDirection, skip, limit) =>
        api.getOfferUnitsOfferV2UnitsGet(skip, filter, limit),
      (units) => {
        const rows = [];
        units.forEach((unit) => {
          rows.push({
            values: {
              id: unit.id,
              short: unit.short,
              name: unit.name
            },
            route: () => {
              // noop
            }
          });
        });
        return rows;
      }, [
        {
          name: "short",
          headerName: "Kürzel",
          sortable: true
        }, {
          name: "name",
          headerName: "Beschreibung",
          sortable: true
        }
      ],
      (api) => api.countOfferUnitsOfferV2CountUnitsGet()
    );
    this.unitsDatasource.loadData();
  }

  openEditDialog(unit?: OfferUnit) {
    const dialogRef = this.dialog.open(OfferUnitsEditDialogComponent, {
      width: "1000px",
      data: { unit }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.unitsDatasource.loadData();
    });
  }

}

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
import { headerNewButton, listDeleteButton, listEditButton } from "../offer.util";


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
    this.unitsButtons.push(listEditButton((id) => {
      this.offerService.getOfferUnitOfferV2UnitUnitIdGet(id).pipe(take(1)).subscribe(this.editSubscription);
    }));
    this.unitsButtons.push(listDeleteButton(this.dialog, "Einheit", this.offerService.deleteOfferUnitOfferV2UnitUnitIdDelete, this.unitsDatasource, this.snackBar));
    this.unitsHeaderButtons.push(headerNewButton("Neue Einheit erstellen", this.openEditDialog));
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
    dialogRef.afterClosed().subscribe((result) => {
      if (result)
        this.unitsDatasource.loadData();
    });
  }

}

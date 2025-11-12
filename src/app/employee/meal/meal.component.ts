import { Component, ComponentRef, OnInit } from "@angular/core";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { first } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscriber } from "rxjs";
import { DefaultService, Meal } from "../../../api/openapi";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";

@Component({
    selector: 'app-meal',
    templateUrl: './meal.component.html',
    styleUrls: ['./meal.component.scss'],
    imports: [ToolbarComponent, TableBuilderComponent]
})
export class MealComponent implements OnInit {
  mealDataSource: TableDataSource<Meal>;
  eatingPlaceId: number;
  title = "";
  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;


  constructor(private api: DefaultService, private dialog: MatDialog, private snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eatingPlaceId = parseInt(params.id, 10);
      if (isNaN(this.eatingPlaceId)) {
        console.error("EmployeeDetailComponent: Could not parse userId");
      }
      this.api.getEatingPlacesEatingPlaceEatingPlaceIdGet(this.eatingPlaceId).pipe(first()).subscribe(eatingPlace => {
        this.title = "Mahlzeiten: " + eatingPlace.name;
      });
      this.initMealDataSource();
    });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  private initMealDataSource(): void {
    this.mealDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readMealsMealGet(skip, limit, filter, undefined, this.eatingPlaceId),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                date: moment(dataSource.date).format("DD.MM.YYYY"),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "user.fullname": dataSource.user.fullname,
              },
              route: () => {
                this.mealClicked(dataSource.id);
              },
            });
        });
        return rows;
      },
      [
        { name: "date", headerName: "Datum" },
        { name: "user.fullname", headerName: "Angestellter" },
      ],
      (api) => api.readMealCountMealCountGet(undefined, this.eatingPlaceId),
    );
    this.mealDataSource.loadData();
  }

  private mealClicked(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Mahlzeit löschen?",
        text: "Mahlzeit löschen? Diese Aktion kann nicht rückgängig gemacht werden!",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteMealMealMealIdDelete(id).pipe(first()).subscribe(success => {
          if (success) {
            this.mealDataSource.loadData();
          } else {
            this.snackBar.open("Mahlzeit konnte nicht gelöscht werden", "Ok", {
              duration: 10000,
            });
          }
        });

      }
    });
  }
}

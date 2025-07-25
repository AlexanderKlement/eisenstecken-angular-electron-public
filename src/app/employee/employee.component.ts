import { Component, ComponentRef, OnInit } from '@angular/core';
import { TableDataSource } from '../shared/components/table-builder/table-builder.datasource';
import {
  CustomButton,
  ToolbarComponent,
} from '../shared/components/toolbar/toolbar.component';
import { LockService } from '../shared/services/lock.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { minutesToDisplayableString } from '../shared/date.util';
import { Observable, Subscriber } from 'rxjs';
import {
  AdditionalWorkload,
  DefaultService,
  Fee,
  Journey,
  Maintenance,
  MealSum,
  User,
} from '../../client/api';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { TableBuilderComponent } from '../shared/components/table-builder/table-builder.component';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  imports: [ToolbarComponent, MatTabGroup, MatTab, TableBuilderComponent],
})
export class EmployeeComponent implements OnInit {
  userDataSource: TableDataSource<User>;
  feeDataSource: TableDataSource<Fee>;
  journeyDataSource: TableDataSource<Journey>;
  mealDataSource: TableDataSource<MealSum>;
  maintenanceDataSource: TableDataSource<Maintenance>;
  additionalWorkloadDataSource: TableDataSource<AdditionalWorkload>;
  public buttons: CustomButton[] = [
    {
      name: 'Neuer Benutzer',
      navigate: (): void => {
        this.router.navigateByUrl('/user/edit/new');
      },
    },
  ];
  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;

  constructor(
    private api: DefaultService,
    private locker: LockService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initUserDataSource();
    this.initFeeDataSource();
    this.initJourneyDataSource();
    this.initMealDataSource();
    this.initMaintenanceDataSource();

    this.initAdditionalDataSource();
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>(subscriber => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  private initUserDataSource(): void {
    this.userDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readUsersUsersGet(skip, filter, limit, true),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              fullname: dataSource.fullname,
            },
            route: () => {
              this.router.navigateByUrl(
                '/employee/' + dataSource.id.toString()
              );
            },
          });
        });
        return rows;
      },
      [{ name: 'fullname', headerName: 'Name' }],
      api => api.readUserCountUsersCountGet(true)
    );
    this.userDataSource.loadData();
  }

  private initFeeDataSource(): void {
    this.feeDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readFeesFeeGet(skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              'user.fullname': dataSource.user.fullname,
              amount: dataSource.amount,
              reason: dataSource.reason,
              date: moment(dataSource.date).format('L'),
            },
            route: () => {
              this.feeClicked(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'user.fullname', headerName: 'Benutzer' },
        { name: 'date', headerName: 'Datum' },
        { name: 'reason', headerName: 'Grund' },
        { name: 'amount', headerName: 'Menge [€]' },
      ],
      api => api.readFeeCountFeeCountGet()
    );
    this.feeDataSource.loadData();
  }

  private initJourneyDataSource(): void {
    this.journeyDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJourneysJourneyGet(skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              'user.fullname': dataSource.user.fullname,
              'car.name': dataSource.car.name,
              date: moment(dataSource.date).format('L'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              distance_km: dataSource.distance_km,
            },
            route: () => {
              this.journeyClicked(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'user.fullname', headerName: 'Benutzer' },
        { name: 'date', headerName: 'Datum' },
        { name: 'car.name', headerName: 'Auto' },
        { name: 'distance_km', headerName: 'Distanz [km]' },
      ],
      api => api.readJourneyCountJourneyCountGet()
    );
    this.journeyDataSource.loadData();
  }

  private initMealDataSource(): void {
    this.mealDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readMealSumsMealSumGet(skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: moment(dataSource.date).format('MMMM YYYY'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'eating_place.name': dataSource.eating_place.name,
              sum: dataSource.sum,
            },
            route: () => {
              this.router.navigateByUrl(
                'meal/' + dataSource.eating_place.id.toString()
              );
            },
          });
        });
        return rows;
      },
      [
        { name: 'eating_place.name', headerName: 'Restaurant' },
        { name: 'date', headerName: 'Datum' },
        { name: 'sum', headerName: 'Anzahl' },
      ],
      api => api.readMealSumsMealSumCountGet()
    );
    this.mealDataSource.loadData();
  }

  private feeClicked(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Spese löschen?',
        text: 'Spese löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteFeeFeeFeeIdDelete(id)
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.feeDataSource.loadData();
            } else {
              this.snackBar.open('Spese konnte nicht gelöscht werden', 'Ok', {
                duration: 10000,
              });
            }
          });
      }
    });
  }

  private journeyClicked(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Fahrt löschen?',
        text: 'Fahrt löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteFeeFeeFeeIdDelete(id)
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.journeyDataSource.loadData();
            } else {
              this.snackBar.open('Fahrt konnte nicht gelöscht werden', 'Ok', {
                duration: 10000,
              });
            }
          });
      }
    });
  }

  private initMaintenanceDataSource(): void {
    this.maintenanceDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readMaintenancesMaintenanceGet(skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              month: moment(dataSource.month).format('MMMM YYYY'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'user.fullname': dataSource.user.fullname,
              minutes: minutesToDisplayableString(dataSource.minutes),
            },
            route: () => {
              this.maintenanceClicked();
            },
          });
        });
        return rows;
      },
      [
        { name: 'month', headerName: 'Zeitraum' },
        { name: 'user.fullname', headerName: 'Name' },
        { name: 'minutes', headerName: 'Minutes' },
      ],
      api => api.readMaintenanceCountMaintenanceCountGet()
    );
    this.maintenanceDataSource.loadData();
  }

  private maintenanceClicked(): void {
    console.log('maintenanceClicked');
  }

  private initAdditionalDataSource() {
    this.additionalWorkloadDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readAdditionalWorkloadsAdditionalWorkloadGet(skip, limit, filter),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: moment(dataSource.date).format('dddd, DD.MM.YYYY'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'user.fullname': dataSource.user.fullname,
              minutes: minutesToDisplayableString(dataSource.minutes),
              description: dataSource.description,
            },
            route: () => {
              this.additionalWorkloadClicked(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'date', headerName: 'Datum' },
        { name: 'user.fullname', headerName: 'Name' },
        { name: 'description', headerName: 'Beschreibung' },
        { name: 'minutes', headerName: 'Zeit' },
      ],
      api => api.readAdditionalWorkloadCountAdditionalWorkloadCountGet()
    );
    this.additionalWorkloadDataSource.loadData();
  }

  private additionalWorkloadClicked(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Zusätzliche Arbeiten löschen?',
        text: 'Zusätzliche Arbeiten löschen? Diese Aktion kann nicht rückgängig gemacht werden!',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteAdditionalWorkloadAdditionalWorkloadAdditionalWorkloadIdDelete(
            id
          )
          .pipe(first())
          .subscribe(success => {
            if (success) {
              this.additionalWorkloadDataSource.loadData();
            } else {
              this.snackBar.open(
                'Zusätzliche Arbeiten konnten nicht gelöscht werden',
                'Ok',
                {
                  duration: 10000,
                }
              );
            }
          });
      }
    });
  }
}

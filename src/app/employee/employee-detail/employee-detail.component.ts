import { Component, ComponentRef, OnInit } from '@angular/core';
import { TableDataSource } from '../../shared/components/table-builder/table-builder.datasource';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import {
  CustomButton,
  ToolbarComponent,
} from '../../shared/components/toolbar/toolbar.component';
import { Observable, Subject, Subscriber } from 'rxjs';
import {
  MatFormField,
  MatOption,
  MatSelect,
  MatSelectChange,
} from '@angular/material/select';
import * as moment from 'moment';
import { ServiceDialogComponent } from '../service/service-dialog/service-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ServiceCreateDialogComponent } from '../service/service-create-dialog/service-create-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { minutesToDisplayableString } from '../../shared/date.util';
import {
  AdditionalWorkload,
  DefaultService,
  Fee,
  Journey,
  Meal,
  Service,
  WorkDay,
} from '../../../client/api';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { HoursStepperComponent } from '../../mobile-app/hours/hours-stepper/hours-stepper.component';
import { TableBuilderComponent } from '../../shared/components/table-builder/table-builder.component';
import { MatButton } from '@angular/material/button';
import { MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  imports: [
    ToolbarComponent,
    MatTabGroup,
    MatTab,
    MatFormField,
    MatSelect,
    MatOption,
    DatePipe,
    HoursStepperComponent,
    TableBuilderComponent,
    MatButton,
    NgIf,
    NgForOf,
    AsyncPipe,
    MatLabel,
  ],
})
export class EmployeeDetailComponent implements OnInit {
  feeDataSource: TableDataSource<Fee>;
  journeyDataSource: TableDataSource<Journey>;
  mealDataSource: TableDataSource<Meal>;
  serviceDataSource: TableDataSource<Service>;
  additionalWorkloadDataSource: TableDataSource<AdditionalWorkload>;
  userId: number;

  todayWorkDayLoading = true;
  finishWorkDay: WorkDay;
  todayWorkDay: WorkDay;
  selectedDate: Date;

  workDayLoading = true;
  workDays$: Observable<WorkDay[]>;
  workDay$: Subject<WorkDay>;
  selectedWorkDay: WorkDay;
  showWorkDay = false;

  serviceTabIndex = 4;

  public buttons: CustomButton[] = [
    {
      name: 'Neuer Arbeitstag',
      navigate: (): void => {
        this.router.navigateByUrl('/work_day/new/' + this.userId.toString());
      },
    },
  ];
  title = '';

  public $refresh: Observable<void>;
  showSummaryOnly = true;
  private $refreshSubscriber: Subscriber<void>;

  constructor(
    private api: DefaultService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = parseInt(params.id, 10);
      if (isNaN(this.userId)) {
        console.error('EmployeeDetailComponent: Could not parse userId');
      }
      this.api
        .readUserUsersUserIdGet(this.userId)
        .pipe(first())
        .subscribe(user => {
          this.title = 'Stundenzettel: ' + user.fullname;
        });
      this.workDays$ = this.api.getWorkDaysByUserWorkDayUserUserIdGet(
        this.userId
      );
      this.initWorkDays();
      this.initFeeDataSource();
      this.initJourneyDataSource();
      this.initMealDataSource();
      this.initServiceDataSource();
      this.initAdditionalDataSource();
      this.workDay$ = new Subject<WorkDay>();
    });
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

  workDayChanged(event: MatSelectChange): void {
    this.api
      .getWorkDayWorkDayWorkDayIdGet(event.value)
      .pipe(first())
      .subscribe(workDay => {
        console.log(workDay);
        this.selectedDate = new Date(workDay.date);
        this.showWorkDay = true;
        this.workDay$.next(workDay);
      });
  }

  selectedTabChanged($event: number) {
    const buttonName = 'Wartung erstellen';
    if ($event === this.serviceTabIndex) {
      this.buttons.push({
        name: buttonName,
        navigate: () => {
          this.serviceCreateClicked();
        },
      });
    } else {
      for (let i = 0; i < this.buttons.length; i++) {
        if (this.buttons[i].name === buttonName) {
          this.buttons.splice(i, 1);
          break;
        }
      }
    }
  }

  editWorkDayButtonClicked() {
    this.showSummaryOnly = false;
  }

  private initWorkDays() {
    this.api
      .getCurrentWorkDayByUserWorkDayCurrentUserIdGet(this.userId)
      .pipe(first())
      .subscribe(workDay => {
        this.todayWorkDay = workDay;
      });
    /*
        this.api.getFinishedWorkDayByUserWorkDayFinishedUserIdGet(this.userId).pipe(first()).subscribe(workDay => {
            this.finishWorkDay = workDay;
            this.finishedWorkDayLoading = false;
        });
         */
  }

  private initFeeDataSource(): void {
    this.feeDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readFeesFeeGet(skip, limit, filter, this.userId),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: dataSource.date,
              amount: dataSource.amount,
              reason: dataSource.reason,
            },
            route: () => {
              this.router.navigateByUrl('employee');
            },
          });
        });
        return rows;
      },
      [
        { name: 'date', headerName: 'Datum' },
        { name: 'reason', headerName: 'Grund' },
        { name: 'amount', headerName: 'Menge' },
      ],
      api => api.readFeeCountFeeCountGet(this.userId)
    );
    this.feeDataSource.loadData();
  }

  private initServiceDataSource(): void {
    this.serviceDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readServicesServiceGet(skip, limit, filter, this.userId),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: moment(dataSource.date).format('dddd, DD.MM.YYYY'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'user.fullname': dataSource.user.fullname,
              minutes: minutesToDisplayableString(dataSource.minutes),
            },
            route: () => {
              this.serviceClicked(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'date', headerName: 'Datum' },
        { name: 'user.fullname', headerName: 'Angestellter' },
        { name: 'minutes', headerName: 'Zeit' },
      ],
      api => api.readServiceCountServiceCountGet(this.userId)
    );
    this.serviceDataSource.loadData();
  }

  private serviceClicked(id: number) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      width: '900px',
      data: { id },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceDataSource.loadData();
      }
    });
  }

  private initJourneyDataSource(): void {
    this.journeyDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readJourneysJourneyGet(skip, limit, filter, this.userId),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: dataSource.date,
              'car.name': dataSource.car.name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              distance_km: dataSource.distance_km,
            },
            route: () => {
              this.router.navigateByUrl('employee');
            },
          });
        });
        return rows;
      },
      [
        { name: 'date', headerName: 'Datum' },
        { name: 'car.name', headerName: 'Auto' },
        { name: 'distance_km', headerName: 'Distanz [km]' },
      ],
      api => api.readJourneyCountJourneyCountGet(this.userId)
    );
    this.journeyDataSource.loadData();
  }

  private initMealDataSource(): void {
    this.mealDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readMealsMealGet(skip, limit, filter, this.userId),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'eating_place.name': dataSource.eating_place.name,
              date: dataSource.date,
            },
            route: () => {
              this.router.navigateByUrl('employee');
            },
          });
        });
        return rows;
      },
      [
        { name: 'eating_place.name', headerName: 'Restaurant' },
        { name: 'date', headerName: 'Datum' },
      ],
      api => api.readMealCountMealCountGet(this.userId)
    );
    this.mealDataSource.loadData();
  }

  private serviceCreateClicked() {
    const dialogRef = this.dialog.open(ServiceCreateDialogComponent, {
      width: '900px',
      data: { userId: this.userId },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.serviceDataSource.loadData();
      }
    });
  }

  private initAdditionalDataSource() {
    this.additionalWorkloadDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readAdditionalWorkloadsAdditionalWorkloadGet(
          skip,
          limit,
          filter,
          this.userId
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              date: moment(dataSource.date).format('dddd, DD.MM.YYYY'),
              // eslint-disable-next-line @typescript-eslint/naming-convention
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
        { name: 'description', headerName: 'Beschreibung' },
        { name: 'minutes', headerName: 'Zeit' },
      ],
      api =>
        api.readAdditionalWorkloadCountAdditionalWorkloadCountGet(this.userId)
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

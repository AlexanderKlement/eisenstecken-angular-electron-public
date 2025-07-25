import { Component, ComponentRef, OnInit } from '@angular/core';
import { TableDataSource } from '../shared/components/table-builder/table-builder.datasource';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { LockService } from '../shared/services/lock.service';
import {
  CustomButton,
  ToolbarComponent,
} from '../shared/components/toolbar/toolbar.component';
import { AuthService } from '../shared/services/auth.service';
import { first } from 'rxjs/operators';
import { Observable, Subscriber } from 'rxjs';
import { DefaultService, DeliveryNote } from '../../client/api';
import { AsyncPipe, NgForOf } from '@angular/common';
import { TableBuilderComponent } from '../shared/components/table-builder/table-builder.component';
import { MatFormField, MatLabel } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-delivery-note',
  templateUrl: './delivery-note.component.html',
  styleUrls: ['./delivery-note.component.scss'],
  imports: [
    ToolbarComponent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    AsyncPipe,
    TableBuilderComponent,
  ],
})
export class DeliveryNoteComponent implements OnInit {
  buttons: CustomButton[] = [];
  deliveryNoteDataSource: TableDataSource<DeliveryNote>;

  public $refresh: Observable<void>;

  public selectedYear = moment().year();
  public $year: Observable<number[]>;

  private $refreshSubscriber: Subscriber<void>;

  constructor(
    private api: DefaultService,
    private locker: LockService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initDeliveryNotes();
    this.authService
      .currentUserHasRight('delivery_notes:modify')
      .pipe(first())
      .subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: 'Neuer Lieferschein',
            navigate: () => {
              this.router.navigateByUrl('delivery_note/new');
            },
          });
        }
      });
    this.initRefreshObservables();
    this.$year = this.api.getAvailableYearsDeliveryNoteAvailableYearsGet();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>(subscriber => {
      this.$refreshSubscriber = subscriber;
    });
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  yearChanged() {
    this.initDeliveryNotes();
  }

  private initDeliveryNotes(): void {
    this.deliveryNoteDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readDeliveryNotesDeliveryNoteGet(
          skip,
          limit,
          filter,
          undefined,
          undefined,
          this.selectedYear
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              free: dataSource.number,
              date: moment(dataSource.date).format('L'),
              name: dataSource.name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_address: dataSource.delivery_address,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              'job.displayable_name': dataSource.job
                ? dataSource.job.code + ' - ' + dataSource.job.displayable_name
                : '',
            },
            route: () => {
              this.authService
                .currentUserHasRight('delivery_notes:modify')
                .pipe(first())
                .subscribe(allowed => {
                  if (allowed) {
                    this.locker.getLockAndTryNavigate(
                      this.api.islockedDeliveryNoteDeliveryNoteIslockedDeliveryNoteIdGet(
                        dataSource.id
                      ),
                      this.api.lockDeliveryNoteDeliveryNoteLockDeliveryNoteIdPost(
                        dataSource.id
                      ),
                      this.api.unlockDeliveryNoteDeliveryNoteUnlockDeliveryNoteIdPost(
                        dataSource.id
                      ),
                      'delivery_note/' + dataSource.id.toString()
                    );
                  }
                });
            },
          });
        });
        return rows;
      },
      [
        { name: 'free', headerName: 'Nummer' },
        { name: 'date', headerName: 'Datum' },
        { name: 'name', headerName: 'Empfänger' },
        { name: 'delivery_address', headerName: 'Adresse' },
        { name: 'job.displayable_name', headerName: 'Auftrag' },
      ],
      api =>
        api.readDeliveryNoteCountDeliveryNoteCountGet(
          undefined,
          undefined,
          this.selectedYear
        )
    );
    this.deliveryNoteDataSource.loadData();
  }
}

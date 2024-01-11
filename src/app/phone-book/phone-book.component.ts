import { Component, OnInit } from '@angular/core';
import { TableDataSource } from '../shared/components/table-builder/table-builder.datasource';

import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import {
  ContactDialogData,
  ContactEditDialogComponent,
} from './contact-edit-dialog/contact-edit-dialog.component';
import { TableButton } from '../shared/components/table-builder/table-builder.component';
import { PhoneService } from '../shared/services/phone.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as Sentry from '@sentry/angular-ivy';
import { Contact, ContactTypeEnum, DefaultService } from '../../client/api';

@Component({
  selector: 'app-phone-book',
  templateUrl: './phone-book.component.html',
  styleUrls: ['./phone-book.component.scss'],
})
export class PhoneBookComponent implements OnInit {
  allContactsDataSource: TableDataSource<Contact>;
  clientContactsDataSource: TableDataSource<Contact>;
  supplierContactsDataSource: TableDataSource<Contact>;
  managementContactsDataSource: TableDataSource<Contact>;
  buttons = [
    {
      name: 'Neuer Kontakt',
      navigate: (): void => {
        this.openContactDialog(-1);
      },
    },
  ];

  tableButtons: TableButton[] = [
    {
      name: _ => 'Anrufen',
      class: _ => 'call',
      navigate: ($event: any, id: number) => {
        this.callClicked($event, id);
      },
      color: _ => 'primary',
      selectedField: 'id',
    },
  ];

  constructor(
    private api: DefaultService,
    private router: Router,
    private dialog: MatDialog,
    private phoneService: PhoneService,
    private snackBar: MatSnackBar
  ) {}

  callClicked($event: any, id: number) {
    console.log(id);
    $event.stopPropagation();
    this.api
      .readContactContactContactIdGet(id)
      .pipe(first())
      .subscribe(contact => {
        this.phoneService
          .call(contact.tel)
          .then(() => {
            this.phoneService.close();
          })
          .catch(err => {
            this.phoneService.close();
            Sentry.captureMessage(JSON.stringify(this.phoneService.getLog()));
            this.snackBar.open('Anruf fehlgeschlagen: ' + err, 'Ok', {
              duration: 5000,
            });
          });
      });
  }

  ngOnInit(): void {
    this.initContactsDataSources();
  }

  private initContactsDataSources(): void {
    this.initAllContactsDataSource();
    this.initManagementContactsDataSource();
    this.initSupplierContactsDataSource();
    this.initClientContactsDataSource();
  }

  private reloadData(): void {
    this.allContactsDataSource.loadData();
    this.supplierContactsDataSource.loadData();
    this.clientContactsDataSource.loadData();
    this.managementContactsDataSource.loadData();
  }

  private openContactDialog(id: number) {
    const dialogData: ContactDialogData = {
      id,
    };
    const dialogRef = this.dialog.open(ContactEditDialogComponent, {
      width: '500px',
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe(result => {
        if (result) {
          this.reloadData();
        }
      });
  }

  private initAllContactsDataSource(): void {
    this.allContactsDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readContactsContactGet(skip, limit, filter, undefined),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              name: this.contactToString(dataSource),
              tel: dataSource.tel,
              mail: dataSource.mail,
              note: dataSource.note,
              id: dataSource.id,
            },
            route: () => {
              this.openContactDialog(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'name', headerName: 'Name' },
        { name: 'tel', headerName: 'Telefon' },
        { name: 'mail', headerName: 'Mail' },
        { name: 'note', headerName: 'Notiz' },
      ],
      api => api.readContactCountContactCountGet(undefined, '')
    );
    this.allContactsDataSource.loadData();
  }

  private initSupplierContactsDataSource(): void {
    this.supplierContactsDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readContactsContactGet(
          skip,
          limit,
          filter,
          ContactTypeEnum.SUPPLIER
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              name: this.contactToString(dataSource),
              tel: dataSource.tel,
              mail: dataSource.mail,
              note: dataSource.note,
              id: dataSource.id,
            },
            route: () => {
              this.openContactDialog(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'name', headerName: 'Name' },
        { name: 'tel', headerName: 'Telefon' },
        { name: 'mail', headerName: 'Mail' },
        { name: 'note', headerName: 'Notiz' },
      ],
      api => api.readContactCountContactCountGet(ContactTypeEnum.SUPPLIER, '')
    );
    this.supplierContactsDataSource.loadData();
  }

  private initClientContactsDataSource(): void {
    this.clientContactsDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readContactsContactGet(skip, limit, filter, ContactTypeEnum.CLIENT),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              name: this.contactToString(dataSource),
              tel: dataSource.tel,
              mail: dataSource.mail,
              note: dataSource.note,
              id: dataSource.id,
            },
            route: () => {
              this.openContactDialog(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'name', headerName: 'Name' },
        { name: 'tel', headerName: 'Telefon' },
        { name: 'mail', headerName: 'Mail' },
        { name: 'note', headerName: 'Notiz' },
      ],
      api => api.readContactCountContactCountGet(ContactTypeEnum.CLIENT, '')
    );
    this.clientContactsDataSource.loadData();
  }

  private initManagementContactsDataSource(): void {
    this.managementContactsDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readContactsContactGet(
          skip,
          limit,
          filter,
          ContactTypeEnum.MANAGEMENT
        ),
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach(dataSource => {
          rows.push({
            values: {
              name: this.contactToString(dataSource),
              tel: dataSource.tel,
              mail: dataSource.mail,
              note: dataSource.note,
              id: dataSource.id,
            },
            route: () => {
              this.openContactDialog(dataSource.id);
            },
          });
        });
        return rows;
      },
      [
        { name: 'name', headerName: 'Name' },
        { name: 'tel', headerName: 'Telefon' },
        { name: 'mail', headerName: 'Mail' },
        { name: 'note', headerName: 'Notiz' },
      ],
      api => api.readContactCountContactCountGet(ContactTypeEnum.MANAGEMENT, '')
    );
    this.managementContactsDataSource.loadData();
  }

  private contactToString(dataSource): string {
    const contactString =
      `${dataSource.name1} - ${dataSource.lastname} ${dataSource.name}`.trim();

    if (contactString.startsWith('-')) {
      return contactString.slice(2);
    }

    if (contactString.endsWith('-')) {
      return contactString.slice(0, -2);
    }

    return contactString;
  }
}

import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../shared/components/table-builder/table-builder.datasource';
import {Contact, ContactTypeEnum, DefaultService} from 'eisenstecken-openapi-angular-library';
import {Router} from '@angular/router';
import {first} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {ContactDialogData, ContactEditDialogComponent} from './contact-edit-dialog/contact-edit-dialog.component';

@Component({
    selector: 'app-phone-book',
    templateUrl: './phone-book.component.html',
    styleUrls: ['./phone-book.component.scss']
})
export class PhoneBookComponent implements OnInit {

    allContactsDataSource: TableDataSource<Contact>;
    clientContactsDataSource: TableDataSource<Contact>;
    supplierContactsDataSource: TableDataSource<Contact>;
    normalContactsDataSource: TableDataSource<Contact>;
    buttons = [];

    constructor(private api: DefaultService, private router: Router, private dialog: MatDialog) {

    }

    ngOnInit(): void {
        this.initContactsDataSources();
    }

    private initContactsDataSources(): void {
        this.initAllContactsDataSource();
        this.initNormalContactsDataSource();
        this.initSupplierContactsDataSource();
        this.initClientContactsDataSource();

    }

    private reloadData(): void {
        this.allContactsDataSource.loadData();
        this.normalContactsDataSource.loadData();
        this.supplierContactsDataSource.loadData();
        this.clientContactsDataSource.loadData();
    }

    private openContactDialog(id: number) {
        const dialogData: ContactDialogData = {
            id
        };
        const dialogRef = this.dialog.open(ContactEditDialogComponent, {
            width: '500px',
            data: dialogData
        });
        dialogRef.afterClosed().pipe(first()).subscribe(result => {
            if (result) {
                this.reloadData();
            }
        });
    }

    private initAllContactsDataSource(): void {
        this.allContactsDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readContactsContactGet(skip, limit, filter, undefined)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name1 ? `${dataSource.name} ${dataSource.name1}` : dataSource.name,
                                tel: dataSource.tel,
                                mail: dataSource.mail,
                                note: dataSource.note,
                            },
                            route: () => {
                                this.openContactDialog(dataSource.id);
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'mail', headerName: 'Mail'},
                {name: 'note', headerName: 'Notiz'}
            ],
            (api) => api.readContactCountContactCountGet(undefined, '',)
        );
        this.allContactsDataSource.loadData();
    }

    private initSupplierContactsDataSource(): void {
        this.supplierContactsDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readContactsContactGet(skip, limit, filter, ContactTypeEnum.Supplier)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name1 ? `${dataSource.name} ${dataSource.name1}` : dataSource.name,
                                tel: dataSource.tel,
                                mail: dataSource.mail,
                                note: dataSource.note,
                            },
                            route: () => {
                                this.openContactDialog(dataSource.id);
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'mail', headerName: 'Mail'},
                {name: 'note', headerName: 'Notiz'}
            ],
            (api) => api.readContactCountContactCountGet(ContactTypeEnum.Supplier, '',)
        );
        this.supplierContactsDataSource.loadData();
    }

    private initClientContactsDataSource(): void {
        this.clientContactsDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readContactsContactGet(skip, limit, filter, ContactTypeEnum.Client)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name1 ? `${dataSource.name} ${dataSource.name1}` : dataSource.name,
                                tel: dataSource.tel,
                                mail: dataSource.mail,
                                note: dataSource.note,
                            },
                            route: () => {
                                this.openContactDialog(dataSource.id);
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'mail', headerName: 'Mail'},
                {name: 'note', headerName: 'Notiz'}
            ],
            (api) => api.readContactCountContactCountGet(ContactTypeEnum.Client, '',)
        );
        this.clientContactsDataSource.loadData();
    }

    private initNormalContactsDataSource(): void {
        this.normalContactsDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readContactsContactGet(skip, limit, filter, ContactTypeEnum.Normal)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name1 ? `${dataSource.name} ${dataSource.name1}` : dataSource.name,
                                tel: dataSource.tel,
                                mail: dataSource.mail,
                                note: dataSource.note,
                            },
                            route: () => {
                                this.openContactDialog(dataSource.id);
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'mail', headerName: 'Mail'},
                {name: 'note', headerName: 'Notiz'}
            ],
            (api) => api.readContactCountContactCountGet(ContactTypeEnum.Normal, '',)
        );
        this.normalContactsDataSource.loadData();
    }
}

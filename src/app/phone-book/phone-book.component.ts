import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../shared/components/table-builder/table-builder.datasource';
import {Contact, ContactTypeEnum, DefaultService} from 'eisenstecken-openapi-angular-library';
import {Router} from '@angular/router';

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

    constructor(private api: DefaultService, private router: Router) {

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
                                //this.router.navigateByUrl('/job/' + dataSource.id.toString());
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
                                //this.router.navigateByUrl('/job/' + dataSource.id.toString());
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
                                //this.router.navigateByUrl('/job/' + dataSource.id.toString());
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
                                //this.router.navigateByUrl('/job/' + dataSource.id.toString());
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

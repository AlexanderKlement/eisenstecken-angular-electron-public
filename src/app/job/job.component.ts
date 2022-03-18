import {Component, ComponentRef, OnInit} from '@angular/core';
import {TableDataSource} from '../shared/components/table-builder/table-builder.datasource';
import {DefaultService, Job, Stock} from 'eisenstecken-openapi-angular-library';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, Subscriber} from 'rxjs';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit {
    createdJobDataSource: TableDataSource<Job>;
    acceptedJobDataSource: TableDataSource<Job>;
    finishedJobDataSource: TableDataSource<Job>;
    declinedJobDataSource: TableDataSource<Job>;
    stockTableDataSource: TableDataSource<Stock>;

    public $refresh: Observable<void>;
    private $refreshSubscriber: Subscriber<void>;

    constructor(private api: DefaultService, private router: Router) {
    }

    ngOnInit(): void {
        this.initJobCreated();
        this.initJobsAccepted();
        this.initJobsFinished();
        this.initJobsDeclined();
        this.initStocks();
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

    private initJobCreated(): void {
        this.createdJobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, undefined, 'JOBSTATUS_CREATED', true)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                code: dataSource.code,
                                'client.name': dataSource.client.fullname,
                                'responsible.fullname': dataSource.responsible.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'code', headerName: 'Kommissionsnummer'},
                {name: 'name', headerName: 'Kommission'},
                {name: 'client.name', headerName: 'Kunde'},
                {name: 'responsible.fullname', headerName: 'Zuständig'}
            ],
            (api) => api.readJobCountJobCountGet(undefined, true, undefined)
        );
        this.createdJobDataSource.loadData();
    }

    private initJobsAccepted(): void {
        this.acceptedJobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, undefined, 'JOBSTATUS_ACCEPTED', true)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                code: dataSource.code,
                                'client.name': dataSource.client.fullname,
                                'responsible.fullname': dataSource.responsible.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'code', headerName: 'Kommissionsnummer'},
                {name: 'name', headerName: 'Kommission'},
                {name: 'client.name', headerName: 'Kunde'},
                {name: 'responsible.fullname', headerName: 'Zuständig'}
            ],
            (api) => api.readJobCountJobCountGet(undefined, true, undefined)
        );
        this.acceptedJobDataSource.loadData();
    }

    private initJobsFinished() {
        this.finishedJobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, undefined, 'JOBSTATUS_COMPLETED', true)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                code: dataSource.code,
                                'client.name': dataSource.client.fullname,
                                'responsible.fullname': dataSource.responsible.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'code', headerName: 'Kommissionsnummer'},
                {name: 'name', headerName: 'Kommission'},
                {name: 'client.name', headerName: 'Kunde'},
                {name: 'responsible.fullname', headerName: 'Zuständig'}
            ],
            (api) => api.readJobCountJobCountGet(undefined, true, undefined)
        );
        this.finishedJobDataSource.loadData();
    }

    private initJobsDeclined() {
        this.declinedJobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, undefined, 'JOBSTATUS_DECLINED', true)
            ,
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                code: dataSource.code,
                                'client.name': dataSource.client.fullname,
                                'responsible.fullname': dataSource.responsible.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'code', headerName: 'Kommissionsnummer'},
                {name: 'name', headerName: 'Kommission'},
                {name: 'client.name', headerName: 'Kunde'},
                {name: 'responsible.fullname', headerName: 'Zuständig'}
            ],
            (api) => api.readJobCountJobCountGet(undefined, true, undefined)
        );
        this.declinedJobDataSource.loadData();
    }

    private initStocks() {
        this.stockTableDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readStocksStockGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                id: dataSource.id,
                                name: dataSource.name
                            },
                            route: () => {
                                this.router.navigateByUrl('stock/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'}
            ],
            (api) => api.readStockCountStockCountGet()
        );
        this.stockTableDataSource.loadData();
    }
}

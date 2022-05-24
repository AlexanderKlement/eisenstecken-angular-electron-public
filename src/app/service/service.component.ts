import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../shared/components/table-builder/table-builder.datasource';
import {DefaultService, ServiceSum} from 'eisenstecken-openapi-angular-library';
import * as moment from 'moment';
import {minutesToDisplayableString} from '../shared/date.util';
import {Router} from '@angular/router';

@Component({
    selector: 'app-service',
    templateUrl: './service.component.html',
    styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

    serviceDataSource: TableDataSource<ServiceSum>;

    constructor(private api: DefaultService, private router: Router) {
    }

    ngOnInit(): void {
        this.initServiceDataSource();
    }

    private initServiceDataSource(): void {
        this.serviceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readServiceSumsServiceSumGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                //month: moment(dataSource.month).format('MMMM YYYY'),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'user.fullname': dataSource.user.fullname,
                                //internal: minutesToDisplayableString(dataSource.internal),
                                //external: minutesToDisplayableString(dataSource.external),
                            },
                            route: () => {
                                this.router.navigateByUrl('service/' + dataSource.user.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                //{name: 'month', headerName: 'Zeitraum'},
                {name: 'user.fullname', headerName: 'Name'},
                //{name: 'internal', headerName: 'Intern'},
                //{name: 'external', headerName: 'Extern'}
            ],
            (api) => api.readServiceSumCountServiceSumCountGet()
        );
        this.serviceDataSource.loadData();
    }

}

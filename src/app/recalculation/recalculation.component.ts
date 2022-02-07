import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../shared/components/table-builder/table-builder.datasource';
import {DefaultService, Job} from 'eisenstecken-openapi-angular-library';
import {Router} from '@angular/router';
import {concat, merge} from 'rxjs';
import {CustomButton} from '../shared/components/toolbar/toolbar.component';

@Component({
    selector: 'app-recalculation',
    templateUrl: './recalculation.component.html',
    styleUrls: ['./recalculation.component.scss']
})
export class RecalculationComponent implements OnInit {

    jobDataSource: TableDataSource<Job>;
    buttons: CustomButton[] = [
        {
            name: 'Oberflächen-Vorlage',
            navigate: () => {
                this.router.navigateByUrl('paint-template');
            }
        },
    ];


    constructor(private api: DefaultService, private router: Router) {
    }

    ngOnInit(): void {
        this.initJobDataSource();
    }

    initJobDataSource(): void {
        this.jobDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, undefined, 'JOBSTATUS_ACCEPTED, JOBSTATUS_COMPLETED', true),
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
                                this.router.navigateByUrl('/recalculation/' + dataSource.id.toString());
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
            (api) => api.readJobCountJobCountGet('JOBSTATUS_COMPLETED', true)
        );
        this.jobDataSource.loadData();
    }

}

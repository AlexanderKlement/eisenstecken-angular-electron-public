import {Component, OnInit} from '@angular/core';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {DefaultService, InfoPage} from 'eisenstecken-openapi-angular-library';
import {first} from 'rxjs/operators';
import {AuthService} from '../../shared/services/auth.service';
import {CustomButton} from '../../shared/components/toolbar/toolbar.component';
import {MatDialog} from '@angular/material/dialog';
import {
    InfoPageSettingEditDialogComponent
} from './info-page-setting-edit-dialog/info-page-setting-edit-dialog.component';

@Component({
    selector: 'app-info-page-settings',
    templateUrl: './info-page-settings.component.html',
    styleUrls: ['./info-page-settings.component.scss']
})
export class InfoPageSettingsComponent implements OnInit {
    infoPageDataSource: TableDataSource<InfoPage>;

    public buttons: CustomButton[] = [];
    showNewButton = false;

    constructor(private api: DefaultService, private authService: AuthService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.infoPageDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readInfoPagesInfoPageGet(skip, limit),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                body: dataSource.body.substring(0, 40)
                            },
                            route: () => {
                                this.authService.currentUserHasRight('info_pages:create').pipe(first()).subscribe((allowed) => {
                                    if (allowed) {
                                        this.openDialog(dataSource.id);
                                    }
                                });
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'body', headerName: 'Inhalt'},
            ],
            (api) => api.readClientCountClientCountGet()
        );
        this.infoPageDataSource.loadData();

        this.authService.currentUserHasRight('info_pages:create').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.showNewButton = true;
            }
        });
    }


    openDialog(id: number): void {
        const dialogRef = this.dialog.open(InfoPageSettingEditDialogComponent, {
            width: '1000px',
            data: {id},
        });
        dialogRef.afterClosed().subscribe(() => {
            this.infoPageDataSource.loadData();
        });
    }

}

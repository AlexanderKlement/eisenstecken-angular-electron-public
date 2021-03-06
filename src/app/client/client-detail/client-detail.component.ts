import {Component, ComponentRef, OnInit, ViewChild} from '@angular/core';
import {Client, DefaultService, Job} from 'eisenstecken-openapi-angular-library';
import {InfoDataSource} from '../../shared/components/info-builder/info-builder.datasource';
import {ActivatedRoute, Router} from '@angular/router';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {InfoBuilderComponent} from '../../shared/components/info-builder/info-builder.component';
import {CustomButton} from '../../shared/components/toolbar/toolbar.component';
import {AuthService} from '../../shared/services/auth.service';
import {first} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subscriber} from 'rxjs';

@Component({
    selector: 'app-client-detail',
    templateUrl: './client-detail.component.html',
    styleUrls: ['./client-detail.component.scss'],
})
export class ClientDetailComponent implements OnInit {

    @ViewChild(InfoBuilderComponent) child: InfoBuilderComponent<Client>;
    public infoDataSource: InfoDataSource<Client>;
    public tableDataSource: TableDataSource<Job>;
    public id: number;
    public buttons: CustomButton[] = [];
    jobsAvailable = false;

    public $refresh: Observable<void>;
    private $refreshSubscriber: Subscriber<void>;

    constructor(private api: DefaultService, private dialog: MatDialog,
                private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute,
                private authService: AuthService) {
    }

    initRefreshObservables(): void {
        this.$refresh = new Observable<void>((subscriber => {
            this.$refreshSubscriber = subscriber;
        }));
    }

    onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
        this.$refreshSubscriber.next();
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.id = parseInt(params.id, 10);
            if (isNaN(this.id)) {
                console.error('Cannot parse given id');
                this.router.navigate(['client']);
                return;
            }
            this.initInfoDataSource();
            this.initTableDataSource();
        });
        this.authService.currentUserHasRight('clients:modify').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttons.push({
                    name: 'Bearbeiten',
                    navigate: () => {
                        this.child.editButtonClicked();
                    }
                });
            }
        });
        this.authService.currentUserHasRight('jobs:create').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttons.push({
                        name: 'Neuer Auftrag',
                        navigate: (): void => {
                            this.router.navigateByUrl('/job/edit/new/' + this.id.toString());
                        }
                    }
                );
            }
        });
        this.authService.currentUserHasRight('jobs:all').pipe(first()).subscribe(allowed => {
            this.jobsAvailable = allowed;
        });
        this.authService.currentUserHasRight('clients:delete').pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttons.push({
                        name: 'Kunde l??schen',
                        navigate: (): void => {
                            this.deleteCurrentClient();
                        }
                    }
                );
            }
        });
        this.initRefreshObservables();
    }

    private initInfoDataSource() {
        this.infoDataSource = new InfoDataSource<Client>(
            this.api.readClientClientClientIdGet(this.id),
            [
                {
                    property: 'fullname',
                    name: 'Name'
                },
                {
                    property: 'mail1',
                    name: 'Mail'
                },
                {
                    property: 'mail2',
                    name: 'Mail'
                },
                {
                    property: 'tel1',
                    name: 'Telefon'
                },
                {
                    property: 'tel2',
                    name: 'Telefon'
                },
                {
                    property: 'contact_person',
                    name: 'Ansprechpartner'
                },
                {
                    property: 'fiscal_code',
                    name: 'Steuernummer'
                },
                {
                    property: 'vat_number',
                    name: 'P. IVA'
                },
                {
                    property: 'codice_destinatario',
                    name: 'Empf??ngerkodex'
                },
                {
                    property: 'pec',
                    name: 'PEC'
                },
                {
                    property: 'language.name.translation',
                    name: 'Sprache'
                },
            ],
            '/client/edit/' + this.id.toString(),
            this.api.islockedClientClientIslockedClientIdGet(this.id),
            this.api.lockClientClientLockClientIdPost(this.id),
            this.api.unlockClientClientUnlockClientIdPost(this.id)
        );
    }

    private initTableDataSource() {
        this.tableDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readJobsJobGet(skip, limit, filter, this.id, undefined, true),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    let subjobs = '';
                    for (const subjob of dataSource.sub_jobs) {
                        subjobs += subjob.name + ', ';
                    }
                    if (subjobs.length > 3) {
                        subjobs = subjobs.slice(0, -2);
                    }
                    rows.push(
                        {
                            values: {
                                id: dataSource.id,
                                name: dataSource.code + ' - ' + dataSource.name,
                                description: subjobs,
                            },
                            route: () => {
                                this.router.navigateByUrl('/job/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Auftrag'},
                {name: 'description', headerName: 'Unterauftrag'}
            ],
            (api) => api.readJobCountJobCountGet(undefined, true, this.id)
        );
        this.tableDataSource.loadData();
    }

    private deleteCurrentClient() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Kunde l??schen?',
                text: 'Diese Aktion kann nicht r??ckg??ngig gemacht werden.'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.deleteClientClientClientIdDelete(this.id).pipe(first()).subscribe(success => {
                    if (success) {
                        this.router.navigateByUrl('client');
                    } else {
                        this.snackBar.open('Beim Ausblenden ist ein Fehler aufgetreten: Der Kunde darf keine Auftr??ge enthalten', 'Ok', {
                            duration: 10000
                        });
                        console.error('Could not delete client');
                    }
                });
            }
        });
    }
}

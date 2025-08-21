import {Component, ComponentRef, OnInit} from "@angular/core";
import {TableDataSource} from "../shared/components/table-builder/table-builder.datasource";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomButton} from "../shared/components/toolbar/toolbar.component";
import {AuthService} from "../shared/services/auth.service";
import {first} from "rxjs/operators";
import {Observable, Subscriber} from "rxjs";
import {DefaultService, Client} from "../../api/openapi";
@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.scss'],
    standalone: false
})

export class ClientComponent implements OnInit {

    public privateClientDataSource: TableDataSource<Client>;
    public businessClientDataSource: TableDataSource<Client>;

    public buttons: CustomButton[] = [];
    public $refresh: Observable<void>;
    private $refreshSubscriber: Subscriber<void>;

    constructor(private api: DefaultService, private router: Router, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.initPrivateClients();
        this.initBusinessClients();
        this.authService.currentUserHasRight("clients:create").pipe(first()).subscribe(allowed => {
            if (allowed) {
                this.buttons.push({
                    name: "Neuer Kunde",
                    navigate: (): void => {
                        this.router.navigateByUrl("/client/edit/new");
                    }
                });
            }
        });
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

    private initPrivateClients() {
        this.privateClientDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readClientsClientGet(skip, limit, filter, true, false),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                id: dataSource.id,
                                name: dataSource.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl("/client/" + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: "id", headerName: "ID"},
                {name: "name", headerName: "Name"}
            ],
            (api) => api.readClientCountClientCountGet()
        );
        this.privateClientDataSource.loadData();
    }

    private initBusinessClients() {
        this.businessClientDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readClientsClientGet(skip, limit, filter, false, true),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                id: dataSource.id,
                                name: dataSource.fullname,
                            },
                            route: () => {
                                this.router.navigateByUrl("/client/" + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: "id", headerName: "ID"},
                {name: "name", headerName: "Name"}
            ],
            (api) => api.readClientCountClientCountGet()
        );
        this.businessClientDataSource.loadData();
    }
}

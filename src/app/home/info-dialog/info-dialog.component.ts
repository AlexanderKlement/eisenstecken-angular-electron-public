import {Component, OnInit} from '@angular/core';
import {
    Contact,
    DefaultService,
    Price,
    TechnicalData,
    User,
    Credential,
    InfoPage
} from 'eisenstecken-openapi-angular-library';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {MatDialogRef} from '@angular/material/dialog';
import {AuthService} from '../../shared/services/auth.service';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';

interface Update {
    versionName: string;
    changes: string[];
}

@Component({
    selector: 'app-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls: ['./info-dialog.component.scss']
})
export class InfoDialogComponent implements OnInit {
    userDataSource: TableDataSource<User>;
    contactDataSource: TableDataSource<Contact>;
    priceDataSource: TableDataSource<Price>;
    technicalDataDataSource: TableDataSource<TechnicalData>;
    credentialDataSource: TableDataSource<Credential>;
    userCanViewPrice = false;
    infoPages$: Observable<InfoPage[]>;

    updateList: Update[] = [
        {
            versionName: '0.8.11',
            changes: [
                'Falls eine Bestellung erstellt wird werden nun 2 PDF geliefert: intern und extern. Das externe PDF ist dasselbe was' +
                'derzeit schon generiert wird. Das interne enthält die Bemerkung welche beim Eintragen der Bestellung notiert werden kann.',
                'Bestellungen können nun bestellt werden wie Lieferanten. Sollte von einem Projekt/Auftrag bereits eine ' +
                'erstellte/bestellte oder erhaltenen' +
                'Bestellung vorhanden sein, wird jeder neue Artikel zu dieser hinzugefügt. Über den Status kann keine' +
                ' Einflussnahme mehr getätigt werden.',
                'In der Ansicht "Bestellung: Details, kann nun direkt zu den entsprechenden Lagern oder Lieferant navigiert werden.',
                'Bei Angeboten erstellen oder bearbeiten ist das "+" nun fixiert und weiter rechts',
                'Im Homebildschirm wurden die Menükacheln überarbeitet um der neuen Bildschirmgröße gerecht zu werden.'
            ]
        },
        {
            versionName: '0.8.10',
            changes: [
                'Dieses Info-Feld hinzugefügt um alle Benutzer über die laufenden Änderungen zu informieren',
                'Bei den Einstellungen (Spalte Angebote) wurden die Zeilen die nicht mehr benötigt werden entfernt. ' +
                'Dazu zählen Position und Name, welche jetzt direkt vom jeweiligen Benutzer verwendet werden.',
                'Das Beschreibungsfeld bei Angebot erstellen oder bearbeiten ist nun breiter.',
                'Das Beschreibungsfeld bei Angebot erstellen oder bearbeiten passt sich nun in der Höhe laufend an.',
                'Wenn man im Fenster "Bestellungen: Details" die Einheit ändert, sollte diese nun korrekt übernommen werden.',
                'Lieferanten können nun als Favorit markiert werden (Im Fenster Bestellungen). Markierte erscheinen in der' +
                'List ganz oben',
                'Sollten auf einen Lierferanten mehrere Bestellungen an einem Tag gemacht werden, wird jetzt nicht mehr ' +
                'das alte PDF ausgeliefert.',
                'Bei externer Bestellpdf wird nun angegeben wer die Bestellung aufgegeben hat.',
                'Das PDF "Artikelliste" sollte nun angemessen neue Zeile nehmen und den Text nicht mehr übereinander schreiben',
                'Update Benachrichtigung verschwindet nun nicht mehr hinter Chat/Calendar Frame',
                'Preis von Angebot wird ab jetzt in der Liste ohne MwSt. angezeigt',
                'Angbot wird jetzt nach folgendem Schema benannt "AUFTRAG_KODEX"_"ANGEBOT_NUMMER".pdf',
                'Artikelliste PDF wird nun nach Lieferant - Position geordnet',
                'Die Ansicht Bestellung: Details, ordnet nun Artikel auch nach Position',
                'Das PDF "Bestellung extern" zeigt nun wieder die richtige Überschrift bei Liefertermin an'
            ]
        }
    ];


    constructor(private api: DefaultService, public dialogRef: MatDialogRef<InfoDialogComponent>, private authService: AuthService) {
    }

    ngOnInit():
        void {
        this.initUserDataSource();
        this.initContactDataSource();
        this.initPriceDataSource();
        this.initTechnicalDataDataSource();
        this.initCredentialDataSource();
        this.authService.currentUserHasRight('prices:all').pipe(first()).subscribe(allowed => {
            this.userCanViewPrice = allowed;
        });
        this.infoPages$ = this.api.readInfoPagesInfoPageGet();
    }

    initUserDataSource(): void {
        this.userDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readUsersUsersGet(skip, filter, limit),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                fullname: dataSource.fullname,
                                email: dataSource.email,
                                tel: dataSource.tel,
                                handy: dataSource.handy,
                                // eslint-disable-next-line no-underscore-dangle
                                dial: dataSource.dial,
                            },
                            route: () => {
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'fullname', headerName: 'Name'},
                {name: 'email', headerName: 'Email'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'handy', headerName: 'Handy'},
                {name: 'dial', headerName: 'Kurzwahl'},
            ],
            (api) => api.readUserCountUsersEmployeeCountGet()
        );
        this.userDataSource.loadData();
    }

    initContactDataSource(): void {
        this.contactDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readContactsContactGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                tel: dataSource.tel,
                                mail: dataSource.mail,
                                note: dataSource.note,
                            },
                            route: () => {
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'mail', headerName: 'Email'},
                {name: 'tel', headerName: 'Telefon'},
                {name: 'note', headerName: 'Notiz'},
            ],
            (api) => api.readContactCountContactCountGet()
        );
        this.contactDataSource.loadData();
    }

    initPriceDataSource(): void {
        this.priceDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readPricesPriceGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                price: dataSource.price,
                                comment: dataSource.comment,
                            },
                            route: () => {
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'price', headerName: 'Preis'},
                {name: 'comment', headerName: 'Kommentar'},
            ],
            (api) => api.readPriceCountPriceCountGet()
        );
        this.priceDataSource.loadData();
    }

    initTechnicalDataDataSource(): void {
        this.technicalDataDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readTechnicalDatasTechnicalDataGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                height: dataSource.height,
                                width: dataSource.width,
                                length: dataSource.length,
                            },
                            route: () => {
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Name'},
                {name: 'height', headerName: 'Höhe'},
                {name: 'width', headerName: 'Breite'},
                {name: 'length', headerName: 'Länge'},
            ],
            (api) => api.readTechnicalDataCountTechnicalDataCountGet()
        );
        this.technicalDataDataSource.loadData();
    }

    initCredentialDataSource(): void {
        this.credentialDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) => api.readCredentialsCredentialGet(skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                name: dataSource.name,
                                username: dataSource.username,
                                password: dataSource.password,
                                url: dataSource.url,
                            },
                            route: () => {
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'name', headerName: 'Firma'},
                {name: 'username', headerName: 'Benutzername'},
                {name: 'password', headerName: 'Password'},
                {name: 'url', headerName: 'Link/Kommentar'},
            ],
            (api) => api.readCredentialCountCredentialCountGet()
        );
        this.credentialDataSource.loadData();
    }

    onCloseClick() {
        this.dialogRef.close();
    }
}

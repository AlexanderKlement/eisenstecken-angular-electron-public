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
            versionName: 'In Bearbeitung:',
            changes: [
                'Die Anzahl der ungelesenen Chat Nachrichten stimmt nicht. Außerdem wird der Wert bei jedem ' +
                'Neustart zurückgesetzt.',
                'Um Chat Mitteilungen nicht zu verpassen, solle Programm statt mit "x" zu schließen in Taskleiste minimiert werden. ' +
                'Eingehende Nachrichten werden dann als Benachrichtigung angezeigt. Diese Funktion kann später vielleicht mit Terminen ' +
                'kombiniert werden, sollte dies gewünscht sein.',
                'Bei Bestellungen sollte es möglich sein die Unteraufträge/Projekte einzuklappen, um die ganze Ansicht übersichtlicher' +
                ' zu gestalten.',
                'Wenn Aufträge angenommen werden, wird der Ordner von Angebote in Projekte verschoben. Sollte eine Datei geöffnet sein ' +
                '(oder der Server anderweitig keine Schreibberechtigung auf eine oder mehrere Dateien erhält),' +
                ' werden die restlichen Dateien ' +
                'trotzdem verschoben. Nach Abschluss dieser Operation sind zwei Ordner vorhanden (Angebote und' +
                ' Projekte). mit jeweils mindestens' +
                ' einer Datei. Hier entwerder die Operation nicht durchführen, oder bei Fehlern wieder rückgängig machen.',
                'Mail die sich bei Bestellung öffnet ist nicht optimal formatiert.'
            ]
        },
        {
            versionName: '0.8.20',
            changes: [
                'Anfragen haben nun einen anderen Text wie Bestellungen in Email.',
                'Digital unterschriebene Rechnungen (.p7m) werden nun korrekt übertragen und sollten nun problemlos ' +
                'importiert werden können.',
                'Eisenstecken-Logo oben links, wird nun nicht mehr so groß wenn man mit der Maus darüberfährt.'
            ]
        },
        {
            versionName: '0.8.19',
            changes: [
                'Eingangsrechnungen können nun gelöscht werden.',
                'Unbezahlte Ein- und Ausgangsrechnungen können nun gedruckt werden (oder PDF erzeugt).',
                'Bestellungen zeigen nun eine Vorschau der bestellten Artikel an'
            ]
        },
        {
            versionName: '0.8.18',
            changes: [
                'Ausgangsrechnungen können nun als bezahlt markiert werden.',
                'Bei Bestellungen auf Lager, wird nun falls die Bestellung versandt wurde das Datum und der Bestellende ' +
                'korrekt übernommen',
                'Die Genauigkeit der Menge beim Artikellisten-PDF von 2 auf 3 Nachkommastellen erhöht.',
                'Eingangsrechnung können nun importiert werden. Unterstützte Formate: xml und p7m',
                'Eingangsrechnungen können nun als bezahlt markiert werden.',
                'Rechnungen können nun als bezahlt markiert werden. ',
                'Fehler behoben, bei dem Aritkel, die von Lager auf Aufträgen bestellt wurden, nicht korrekt registriert wurden.',
                'Bei Angebot die Postitionsüberschrift (hoffentlich) wieder auf Roboto geändert und Fett gemacht.',
                'Bindestrich bei Auftragscode in Artikellistenpdf eingefügt.',
                'Ein- und Ausgangsrechnungen werden nun in "Alle", "Bezahlt" und "Unbezahlt" unterteilt.',
                'Aufträge können nun korrekt nach dem Nachnamen des Kunden durchsucht werden.',
                'Rechnungen bearbeiten Fenster sollte nun nach dem speichern auf das korrekte Feld zurückverweisen.'
            ]
        },
        {
            versionName: '0.8.17',
            changes: [
                'Pfade für Projekte können jetzt vom Benutzer selbst angepasst werden',
                'Artikellisten haben nun ein neues Format: Der Auftrag oben rechts ist immer der Hauptauftrag. ' +
                'Einzelne Bestellungen werden bei den einzelnen Überschriften mit dem jeweiligen Auftrag bezeichnet.',
                'Bei Nachkalkulation wird nun eine extra Liste mit Oberflächenvorlagen angezeigt. Bei Klick wird die ' +
                'Vorlage in die aktuelle Liste übertragen.',
                'Info Dialog Einstellungen können nun nach oben oder unten verschoben werden.',
                'Rechnungen werden nun in einem separatem Ordner abgespeichert',
                'Bestellungen Fenster sollte nun zentriert sein.'
            ]
        },
        {
            versionName: '0.8.16',
            changes: [
                'Bei Kunden kann jetzt ein Ansprechpartner mit angegeben werden.',
                'Nachkalkulation enthält nun einen neue Lists: "Preise Holzliste". Hier können verschiedene Preise angegeben werden.' +
                ' Dies ersetzt das Feld "Preis Holzliste"',
                'Oberflächen bei Nachkalkulation wird nun mit einer Einheit versehen. Als Standart wird Liter verwendet.',
                'Grafische Ausbesserungen bei Nachkalkulations-pdf',
                'Es können nun Vorlagen für Oberflächen in Nachkalkulation erstellt werden.',
                'Suchfunktion bei "Bestellungen: Details" sollte nun wie gewünscht funktionieren.',
                'Die Schriftart Roboto-Bold ist nun im Programm enthalten und muss nicht separat installiert werden'
            ]
        },
        {
            versionName: '0.8.15',
            changes: [
                'Aufträge und Unteraufträge können nun gelöscht werden.',
                'Aufträge können jetzt auch nach Kommissionsnummer durchsucht werden.',
                'Ausgangsrechnungen enthalten nun nicht mehr den Auftragsnamen im Dateinamen.',
                'Artikel werden bei Bestellungen nun anders geordnet: Favoriten -> Alphabetisch; Andere -> Neueste zuerst.',
                'Aufträge werden jetzt anders geordnet: Nimm x der neuesten Aufträge -> ordne Hauptaufträge vor Kleinstaufträge -> ' +
                'ordner nach Kodex alphabetisch absteigend',
            ],
        },
        {
            versionName: '0.8.14',
            changes: [
                'Eigene Ansicht erstellt mit der es möglich ist alle Artikel eines Lieferanten/ Lager einzusehen und zu bearbeiten. ' +
                'Diese Ansicht ist erreichbar, wenn man auf den jeweiligen Lieferanten geht und oben rechts auf Artikel klickt.',
                'Artikel werden nun bei einer Änderung dupliziert um ältere Bestellungen nicht zu alternieren.',
                'Email Text bei Bestellungen kann nun sehr viel besser formatiert werden. (Müssen wir noch abändern sobald ' +
                'alle diese Version haben)',
                'Text bei Nachkalkulation sollte nun früher aufhöhren.',
                'Bei Nachkalkulatio wurde spalte Name in Kommission umbenannt.',
                'Nachkalkulationen können nun auch nach Kunden durchsucht werden.',
                'In der Ansicht "Bestellungen: Zusammenstellen" können nun auch Artikel gelöscht werden.',
                'Lierschein Beschreibung Feld ist nun breiter',
                'Kommazahlen wurden überarbeitet und sollten nun korrekt mit 2 Nachkommastellen (Mengenangaben ausgenommen) ' +
                'angezeigt. Als Kommazeichen wird "," verwendet. Sollte ich was übersehen haben bitte melden.'
            ]
        },
        {
            versionName: '0.8.13',
            changes: [
                'Angebot zeigt nun die Nummerierungen der einzelnen Positionen während des Erstellens oder Bearbeiten an.',
                'Checkbox "Alternative" (bei Angebot) ist nun viel kleiner.',
                'Nachkalkulationen sind nun für Aufträge mit Status "Fertig" UND "Angenommen" verfügbar',
                'Nachkalkulation enthält nun zusätzliche optionale Felder für Oberflächen.',
                'Man schreibt nicht mehr unter den Klebestreifen bei den Notizen auf der Startseite.',
                'Bei Angeboten erstellen oder bearbeiten sind Positionen nun nummeriert.',
                'In den Ansichten "Versendete Bestellungen" und "Bestellungen: Details" werden die Felder die ein Datum enthalten ' +
                'nun korrekt formatiert.',
                'Rechnungen löschen sollte nun wie gewünscht funktionieren.',
                'MwStr. Nr. und Str.Nr sind nun beim Rechnungspdf auf der richtigen Position.',
                'Materialbeschreibung im Angebots PDF wird nun bei Postionsnummerierung ignoriert.',
                'Anfragen sind nun verfügbar: Bestellte Artikel, die als Anfrage markiert wurden, können nun beim Lieferanten ' +
                'unter dem separaten Menüpunkte "Anfrage verschicken" als PDF generiert und versandt werden. Das PDF wurde ' +
                'nach Gefühl gestaltet. Einfach melden falls ich hier noch was ändern soll.',
                'Die Ansicht "Bestellung" wurde verbreitert und das Feld mit dem Artikelname ist nun mehrzeilig falls notwendig',
                'Bei der Ansicht "Bestellung" werden Suchergebnisse nun fatt markiert.',
                'Lieferant: Details hat neuen Tab mit allen Anfragen'
            ]
        },
        {
            versionName: '0.8.12',
            changes: [
                'Stück ist nun Standardeinheit bei Bestellungen.',
                'Einzelne oder mehrere Artikel können nun auf andere Aufträge oder Lager verschoben werden.',
                'In der Ansicht "Lieferanten/Lager" werden Lieferanten nun im gleichen Stil geordnet wie bei den Bestellungen: ' +
                'Favoriten: Alphabetisch(Auftsteigend) -> Nicht Favoriten: Alphabetisch(Aufsteigend).',
                'Bei Versendete Bestellungen (das sind im Grunde all jene zu denen die Bestllung PDFs generiert wurden, gibt ' +
                'es jetzt eine Schaltfläche die das erneute generieren der PDFs erlaubt. Diese überschreiben NICHT das vorhergende PDF.',
                'Beim Bestellen von Lager auf Auftrag wird jetzt anstatt eine PDF anzuzeigen, einfach eine kleine Bestätigung angezeigt..'
            ]
        },
        {
            versionName: '0.8.11',
            changes: [
                'Falls eine Bestellung erstellt wird werden nun 2 PDF geliefert: intern und extern. Das externe PDF ist dasselbe das ' +
                'derzeit schon generiert wird. Das interne enthält die Bemerkung welche beim Eintragen der Bestellung notiert werden kann.',
                'Bestellungen können nun bestellt werden wie Lieferanten. Sollte von einem Projekt/Auftrag bereits eine ' +
                'erstellte/bestellte oder erhaltenen.' +
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

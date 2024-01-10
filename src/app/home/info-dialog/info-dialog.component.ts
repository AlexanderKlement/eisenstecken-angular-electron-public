import {Component, OnInit} from '@angular/core';
import {
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
  priceDataSource: TableDataSource<Price>;
  technicalDataDataSource: TableDataSource<TechnicalData>;
  credentialDataSource: TableDataSource<Credential>;
  userCanViewPrice = false;
  infoPages$: Observable<InfoPage[]>;

  updateList: Update[] = [
    {
      versionName: 'In Bearbeitung:',
      changes: [
        'Die Möglichkeit einbauen, die Kosten aller Autos zu verändern',
        'Zeitzonen von Chat-Nachrichten anpassen',
        'Chat sollte anzeigen ob neue Nachrichten vorhanden sind',
        'Navigation funktioniert nicht richtig: Änderungen verwerden Dialog kann nicht geschlossen werden'
      ]
    },
    {
      versionName: '1.1.17',
      changes: [
        'Benutzer wird ausgeloggt wenn sein token verfällt.',
        'Buttons werden nun wieder hinzugefügt wenn sich die Daten ändern.',
      ]
    },
    {
      versionName: '1.1.16',
      changes: [
        'Aufträge können nun in andere Jahre verschoben werden.'
      ]
    },
    {
      versionName: '1.1.15',
      changes: [
        'Angebote bearbeiten, Rechnungen bearbeiten und Dialog bei Bestellungen und Artikeln fügt nun automatisch das Eurozeichen' +
        ' und 2 Nachkommastellen hinzu',
        'Sollte Ordner verschieben fehlschlagen, da eine Datei noch geöffnet ist, ergibt sich ein inkonsitenter Zustand, bei dem' +
        ' ein Teil der Dateien verschoben ist. Dadurch lässt sich der Status eines Auftrags nicht mehr ändern. Mit diesem Update wird' +
        ' dieser Zustand erkannt und behoben.',
        '@Luki: Online Bestellungen deaktiviert. Bestellungen von Grohe oder Würth funktionieren nun wieder wie zuvor. In Zukunft werden ' +
        'Onlinebestellungen so angepasst, dass nur noch Internetbestellungen importiert werden.'
      ]
    },
    {
      versionName: '1.1.14',
      changes: [
        'Betreibskalender neu gemacht. Zukünftig wird dieser auf dem Home Bildschirm angezeigt',
        'Homescreen neugestaltet. Dieser ist nun viel schlichter.',
        'Fehler behoben, bei dem beim Rechnung erstellen nur der Vorname angegeben wurde.',
        'Angebot PDF zeigt nun bei Alternativpositionen wieder einen Preis > 0,00€ an',
        'Fehler behoben, bei dem beim Rechnung erstellen nur der Vorname angegeben wurde.',
        'Angebot PDF versucht nun Positionen auf einer Seite zu halten.',
        'Name bei Adressen fasst nun 200 statt 50 Zeichen',
        'Fehler behoben, bei dem Anfragen nicht verschoben werden konnten.',
        'Zeilen bei Nachkalkulation breiter gemacht',
        'Kilometer bei Nachkalkulation kann jetzt verändert werden',
        'Zeitzone bei Mails korrigiert',
        'Erinnerungmails werden nun früher versandt (30 Minuten)',
        'Termine löschen sollte nun richtig funktionieren',
        'Artikel verschieben komplett überarbeitet. Es sollte nun nicht mehr passieren, dass Artikel komplett ' +
        'verschwinden. Sorry Luki, dass des so long gedauert hot!'
      ]
    },
    {
      versionName: '1.1.13',
      changes: [
        'Sollten Kundendaten beim Erstellen einer Rechnung nicht ausgefüllt sein, wird man nun nicht mehr in einer Endlosschleife gefangen',
        'Beim Ausgangsrechnungen PDF werden nun zwei Zeilen angezeigt um Kontostände zu notieren'
      ]
    },
    {
      versionName: '1.1.12',
      changes: [
        'Angebote sollten nun die Rabatte korrekt berechnen',
        'Rechnungen sollten nun neue Zeilen bei einem Zeilenumbruch nehmen',
        'Die nächste Rechnungsnummer wird nun richtig berechnet.'
      ]
    },
    {
      versionName: '1.1.11',
      changes: [
        'Bei Ausgangsrechnung erstellen wird bei Privatkunden nun Name statt Vorname angezeigt',
        'Bei Ausgangsrechnungen wird nun auf dem PDF neue Zeile genommen wenn im Programm neue Zeile genommen wird.',
        'Ausgangsrechnungen sollten nun beim ersten mal speichern schon erstellt werden.',
        'Elektronische Rechnung entfernt nun auch das IT vor dem Codice Fiscale',
        'Checkbox hinzugefügt, damit Tom eingehende Artikel abhaken kann',
        'Absender zu Bestellungs-PDF hinzugefügt',
      ]
    },
    {
      versionName: '1.1.10',
      changes: [
        'Da die Statusänderung von Aufträgen auch Ordner verschiebt, wird nun vor jeder Änderung überprüft, ob Benutzer Dateien ' +
        'geöffnet haben. Sollte dies der Fall sein, werden diese dem Nutzer angezeigt, der dann entsprechende Maßnahmen treffen kannt. ' +
        'Achtung: Noch könnte es eventuell vorkommen, dass der Benutzername des sperrenden Benutzers nicht richtig angezeigt wird.',
        'Sollte die Seite gewechselt werden, während man über eine Bestellung hovert, wird der Tooltip nun entsprechend ausgeblendet',
        'Fehler behoben, bei dem Artikelliste nicht generiert werden konnte.'
      ]
    },
    {
      versionName: '1.1.9',
      changes: [
        'Bestellte Artikel in "Ausgewählte Artikel" werden nun richtig geordnet',
        'Die Adressen bei PDF sind nun in der richtigen Reihenfolge',
        'Anfragen können nun in Bestellungen umgewandelt werden'
      ]
    },
    {
      versionName: '1.1.8',
      changes: [
        'Ausgangsrechnungen werden nun richtig geordnet',
        'Bei Kunden werden nun andere Informationen angezeigt'
      ]
    },
    {
      versionName: '1.1.7',
      changes: [
        'Notizen auf dem Homedisplay werden nun immer in der gleichen Reihenfolge dargestellt',
        'Programmname "Eisenstecken - Eibel" in Windows auf "Eibel" beschränkt. Dies betrifft den Betreff oben links' +
        ' und die Beschreibung in der Miniaturansicht',
        'Kalender und Chat Tabs sind nun auf dem Homescreen linksbündig',
        'Das Bild im Knopf in der Taskleiste ist nun kleiner. Das Feld zum klicken bleibt gleich groß',
        'Die Ausloggen taste wurde entfernt. Ausloggen kann nun erreicht werden, wenn man "!logout" in den Chat eingibt',
        'Mehr Abstand zwischen den beiden Kalendern auf der Startseite',
        'Notizen auf der Startseite haben nun die gleiche Farbe wie die anderen Akzentlinien',
        'Aufträge können nun mit dem Text Fertigstellung versehen werden.',
        'Die PDF generierung neu gestaltet, um die Überlappungsprobleme die wir zurzeit haben zu vermeiden. ' +
        'Dies sollte uns auch mehr Möglichkeiten geben um die PDFs anders zu gestalten.',
        'Neues PDF hinzugefügt: Angenommene Aufträge als kurze Übersicht für die Werkstatt',
        'Sucher in Lieferscheinen repariert',
        'Bei Lieferscheinen neue Spalte "Aufträge" hinzugefügt',
        'Bei Aufträgen kann nun direkt auf den Kunden gesprungen werden.',
        'Lieferscheine unterstützen nun mehrere Zeilen in der Artikelbeschreibung',
        'Kleiner Anpassungen im Kunden- und Aufträge erstellen/bearbeiten Fenster.',
        'Lieferscheine, Ein- und Ausgangsrechnungen werden nun nach Jahren sortiert angezeigt. Ähnlich wie dies ' +
        'bei Aufträgen der Fall ist.',
        'Grafische Änderungen bei Rechnungen erstellen/bearbeiten',
        'Titel "Allgemeine Materialbeschreibung" kann nun auch unbenannt werden',
        'Angebot können nun auch mit Prozenten rabattiert werden',
        'Ausgangsrechnungen haben nun eigene Kundendaten. Beim Erstellen einer Ausgansrechnung werden dies vom Kunden übernommen.',
        'Sollte die Steuernummer bei elektronischen Rechnungen nicht gesetzt sein, wird nun die Umsatzsteuer-ID (Partita IVA) verwendet',
        'Sollten Aufträge gelöscht werden, wird das Backup nun in den Unterordner 11_Verwaltung geschoben.',
      ]
    },
    {
      versionName: '1.1.6',
      changes: [
        'Notizen sollten nun nicht mehr die Reihenfolge verändern',
        'Neustarten knopf sollte nach diesem Update wirklich funktionieren',
        'Bei Lieferscheinen sollte nach dem Bearbeiten die Zurücktaste wie gewohnt funktionieren.',
        'Kontake können nun nach "Kunden" oder "Unternehmen" verschoben werden ohne das der entsprechende Kunde ' +
        'im System angelegt werden muss',
        'Kontakte werden nun im Telefonbuch besser dargestellt.',
        'Fehler behoben, der das Telefonieren verhindert hat.',
        'Erinnerungs Mails hinzugefügt'
      ]
    },
    {
      versionName: '1.1.5',
      changes: [
        'Telefonieren sollte jetzt möglich sein, ACHTUNG: diese Funktion befindet sich momentan noch ' +
        'in der Testphase.',
        'Alle Kontake von Betrieb wurden auf Verwaltung migriert und die Kategorie Betrieb wurde entfernt.',
        'Neues Feld zu Benutzer hinzugefügt um die Benutzerdaten von Innovaphone hinzuzufügen',
        'Einige Fehler in Sortierungen behoben',
        'Lieferanten können nun vom Bestelldialog ausgeblendet werden'
      ]
    },
    {
      versionName: '1.1.4',
      changes: [
        'Suche bei Ein- und Ausgangsrechnungen repariert',
        'Erste Version des Anrufens über das Programm implementiert'
      ]
    },
    {
      versionName: '1.1.3',
      changes: [
        'Suche bei Kontakten verbessert. Achtung: Die Suche scheint in anderen Orten noch nicht zu funktionieren',
        'Kontakte füllen nun in Kunden und Lieferanten teile bereits aus',
        'Lieferanten in Unternehmen unbenannt',
        'Telefonnummen können nun nur noch Ziffern und "+" sein',
        'Falls ein Kontakt keine Telefonnummer oder Email enthält, kann er nicht gespeichert werden.',
        'Lieferanten können nun aus der Bestellliste ausgeblendet werden'
      ]
    },
    {
      versionName: '1.1.1',
      changes: [
        'Kontakupdate fast abgeschlossen',
        'Neue Kategorien für Kontakte hinzugefügt',
        'Kontakte können nun auch direkt im Telefonbuch bearbeitet werden',
        'Fehler behoben, der die Ordnung in Angeboten durcheinander gebracht hat'
      ]
    },
    {
      versionName: '1.1.1',
      changes: [
        'Neustart bei Update sollte ab dieser Version wieder funktionieren'
      ]
    },
    {
      versionName: '1.1.0',
      changes: [
        'Kontakte von Konverto Telefonbuch in Eisenstecken Telefonbuch importiert',
        'Telefonnummern und Mails von Lieferanten und Kunden auf Telefonbuch migiriert',
        'Telefonbuch wird nun im Hauptmenü angezeigt',
        'Kontakte vom Infoscreen im Hauptmenü entfernt'
      ]
    },
    {
      versionName: '1.0.6',
      changes: [
        'Materialkostenaufschlag wird nun korrekt gespeichert.',
        'Rechnungen werden nun wieder im korrekten Ordner abgespeichert und korrekt nach dem Erzeugen geöffnet.',
        'Frischeis Bestellungen sollten nun korrekt in Outlook geöffnet werden.',
      ]
    },
    {
      versionName: '1.0.5',
      changes: [
        'Artikellisten-PDF enthält nun auch das Feld "Bemerkung (intern)" unter jedem Artikel',
        'Aufträge können beim Erstellen nun auch auf andere Jahre gelegt werden. Das Erstellfenster füllt das ' +
        'derzeitige Jahr aus, der Benutzer kann dies jedoch ändern.',
        'Teamsitzungen wurden von 9 auf 14 uhr verschoben',

      ]
    },
    {
      versionName: '1.0.4',
      changes: [
        'Rechnungen, Angebote und Lieferscheine, markieren sich selbst als "bearbeitet", wenn mindestens ein Eingabefeld ' +
        'modifiziert wurde. Falls das Fenster nun ohne zu speichern verlassen wird, kann wird der Benutzer auf die ' +
        'ungespeicherten ' +
        'Änderungen hingewiesen. Achtung: Hier wird nicht der Inhalt verglichen, sondern jediglich darauf geachtet ob ' +
        'mindestens eine ' +
        'Änderung vorgenommen wurde.',
        'Programmname in Titelleiste ein bisschen nach rechts verschoben.',
        'Digitale Rechnungen werden nun in den entsprechenden Ordner verschoben'
      ]
    },
    {
      versionName: '1.0.3',
      changes: [
        'Fahrten müssen nun mit Aufträgen oder eigenen Beschreibungen versehen werden.',
        'Kalender auf Startseite nun nebeneinander positioniert, um mehr Überblick zu erhalten',
        'Nachkalkulation-PDF enthält nun auch Einheit',
        'Fahrten sind nun (sofern mit Job verknüpft) auch in der Nachkalkulation sichtbar.',
        'Fahrten können mit einem Preis ausgestattet werden, der in der Nachkalkulation angepasst werden kann',
        'Fehler behoben, bei dem die Nachkalkulation beim Erstellen einfriert und das Programm abstürzen lässt.',
        'Digitale Rechnung sollte nun auch die Steuernummer von Privatekunden direkt eintragen'
      ]
    },
    {
      versionName: '1.0.2',
      changes: [
        'Masterpassword eingeführt',
        'Anmeldebildschirm für Smartphones vergrößert',
        'Fehler behoben, bei dem die Zurücktaste nicht mehr funktioniert hat, nachdem man einen Kunden bearbeitet hat.',
        'Nachkalkulation wird nun in Ordner generiert "9_Nachkalkulation"',
        'Suche für Kunden mit mehreren Namen optimiert (Bsp: Kerschbaumer Konrad)',
        'Lehrlingslogo für pdfs auf 2022 aktualisiert.',
        'Mail versand optimiert: "Mails sollten nun nicht mehr Vorlagen erzeugen und geben eine Fehlermeldung zurück, ' +
        'falls nicht gesandt werden.'
      ]
    },
    {
      versionName: '1.0.1',
      changes: [
        'Mobile app kann nun installiert werden. Farbe der Taskleiste wurde von blau auf gelb geändert.',
        'Stunden eintragen Oberfläche leicht überarbeitet'
      ]
    },
    {
      versionName: '1.0.0',
      changes: [
        'Fehler behoben, bei dem Mehrfachrabatte bei Eingangsrechnungen falsch berechnet wurden. Dies hat nur Einzelsummen ' +
        'beeinflusst und hatte keine Auswirkung auf Gesamtsummen. ACHTUNG: Dies korrigiert nur Rechnungen, welche ' +
        'ab jetzt importiert werden.',
        'Kleineren Übersetzungsfehler auf Lieferschein korrigiert',
        'Stunden eintragen überarbeitet, um die Übersicht zu erhöhen. Aufträge eintragen in eigenen Dialog ausgelagert. ' +
        'So müssen weniger Elemente auf der initalen Seite angezeigt werden.'
      ]
    },
    {
      versionName: '0.9.9',
      changes: [
        'Stunden eintragen überarbeitet. Die Zeit wird nun nicht mehr gestoppt, sondern der Benutzer trägt die ' +
        'Daten einfach selbst ein. Das Eintragen selbst wurde in verschiedene Teile aufgeteilt, um die Übersicht ' +
        'zu erhöhen.',
        'Ausgangsrechnungen können nun auch nach Kundennamen durchsucht werden.',
        'Beim Erstellen/Bearbeiten von Rechnungen, hat das Beschreibungen-Feld nun mehrere Zeilen.',
        'Mod Nummber bei Bestellungen hat nun eine maximale Länge von 30 Zeichen',
        'Fehler behoben, wo bei Anfragen senden auch andere Artikel von diesem Lieferanten verschwunden sind.',
        'Angebote haben nun ein Feld wo Kunden unterschreiben können.',
      ]
    },
    {
      versionName: '0.9.8',
      changes: [
        'Lieferschein lässt nun erneutes Speichern bei Fehler zu.',
        'Neues Restaurant hinzugefügt: Valentin',
        'Montage bei Lieferschein nun auch auf PDF.'
      ]
    },
    {
      versionName: '0.9.7',
      changes: [
        'Empfängerkodex wird nun standartmäßig mit "0000000" eingeführt.',
        'Sollte man Artikel löschen wollen, wird nun ein Bestätigungsdialog geöffnet.'
      ]
    },
    {
      versionName: '0.9.6',
      changes: [
        'Experimenteller Kalender hinzugefügt. Wird in seiner nächsten Form wahrscheinlich ziemlich' +
        ' überarbeitet.'
      ]
    },
    {
      versionName: '0.9.5',
      changes: [
        'Ob ein Artikel eine Anfrage ist, kann nun nachträglich nicht mehr geändert werden.',
        'Unteraufträge in Bestellungen sind nun standartmäßig unter dem Hauptauftrag versteckt. Beim Klick auf ' +
        'einen Hauptauftrag werden alle Unteraufträge eingeklappt und die jeweiligen ausgeklappt. Dies sollte die ' +
        'Übersichtlichkeit erhöhen. Sollten Abtrennungen oder ähnliches gewünscht sein, bitte melden. Denke aber, ' +
        'dass zu viele Elemente die Ansicht nur überladen.',
        'Aufträge werden nun nach Datum sortiert. Bzw. es wird jeweils nur ein Jahr in Aufträgen dargestellt. '
      ]
    },
    {
      versionName: '0.9.4',
      changes: [
        'Falls ein Auftrag gelöscht wird, wird der Benutzer nun nicht mehr durch hunderte Fehlermeldungen generft',
        'Neue Spalten in Rechnungen Fenster eingefügt.',
        'Lieferscheine werden nun wirklich nach Datum geordnet.',
        'Prozentsätze bei Angebot stimmen nun'
      ]
    },
    {
      versionName: '0.9.3',
      changes: [
        'Da die Tabellen nun nicht immer neu geladen werden, kann es vorkommen, dass beim Erstellen eines Auftrags,' +
        ' Lieferschein, Rechnung usw. der neue Eintrag nicht sofort in der Tabelle erscheint. Daher wird beim Erstellen nun ' +
        'der lokale Inhalt mit dem Server verglichen und gegebenenfalls synchronisiert. Des weiteren wird ein solcher Check ' +
        'alle 60 Sekunden asugeführt um Updates anderer Benutzer zeitnah zu sehen.',
      ]
    },
    {
      versionName: '0.9.2',
      changes: [
        'Die meisten Seiten merken sich nun ihren jeweiligen Status. Das heißt, das Such oder Filteroptionen auch noch ' +
        'verfügbar sind wenn man eine andere Seite geöffnet hat. Dies trifft nicht auf Seiten zu die den Name "Erstellen" ' +
        'oder "Bearbeiten" im Titel tragen.',
      ]
    },
    {
      versionName: '0.9.1',
      changes: [
        'Der Chat zeigt nun nicht mehr die Anzahl an ungelesenen Nachrichten an, weil der Benutzer jetzt bei' +
        ' jeder Nachricht eine Benachrichtigung erhält.',
        'Spalten in Tabellen haben nur einen kleinen Abstand, um die Lesbarkeit zu erhöhen.',
        'Die ESC-Taste hat nun die gleiche Funktion wie die Zurücktaste.',
        'Abgeschlossene Aufträge werden nun in einen separaten Ordner verschoben.',
        'Mehrwertsteuer und Rabatt werden nun im Angebot richtig angezeigt.',
        'Suche nach Bestellungen in Aufträgen funktioniert nun auch auf Spalte "Herkunft"',
        'Passwordmanager gibt mehr Übersicht über geänderte Passwörter',
        'Bis Logout Knopf verschoben wird, einen Bestätigungsdialog eingeführt',
        'Zahlungen bei Ausgangsrechnungen sollte nun wieder funktionieren.',
        'Tasten bei Zahlungen je nach Bezahlstatus geändert.'
      ]
    },
    {
      versionName: '0.9.0',
      changes: [
        'Das Programm wird nun bei einem Klick auf "Minimieren" oder "Schließen" immer rechts ' +
        'unten als in die Taskleiste ' +
        'geschoben. Wieder geöffnet kann das Programm wie gewohnt über die Verknüpfung oder ' +
        'mit Rechtsklick auf die Taskleiste und ' +
        '"Offnen". Wichtig: Ein vollständiges Schließen ist nur über die Option "Schließen" in der Taskleiste möglich.',
        'Der aktuelle Tag wird nun im Kalender farbig markiert.'
      ]
    },
    {
      versionName: '0.8.20',
      changes: [
        'Anfragen haben nun einen anderen Text wie Bestellungen in Email.',
        'Digital unterschriebene Rechnungen (.p7m) werden nun korrekt übertragen und sollten nun problemlos ' +
        'importiert werden können.',
        'Eisenstecken-Logo oben links, wird nun nicht mehr so groß wenn man mit der Maus darüberfährt.',
        'Eingangsrechnungen mit dem Dokumententype "TD04" (=Gutschrift) zeigen nun einen negativen Gesamtbetrag an.',
        'Kalender started nun immer an einem Montag',
        'Kalendertage Samstag und Sonntag sind nun leicht transparent um diese einfacher zu erkennen.',
        'Notizen haben nun ein schlichteres Design',
        'Pdf für unbezahlt Ein- und Ausgangsrechnungen enthält nun die jeweiligen Gesamtsummen'
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
      (api, filter, sortDirection, skip, limit) => api.readUsersUsersGet(skip, filter, limit, true),
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

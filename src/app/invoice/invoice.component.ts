import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {first} from 'rxjs/operators';
import {CustomButton} from '../shared/components/toolbar/toolbar.component';
import {MatDialog} from '@angular/material/dialog';
import {
    OutgoingInvoiceNumberDialogComponent
} from './outgoing/outgoing-invoice-number-dialog/outgoing-invoice-number-dialog.component';
import {ImportXmlDialogComponent} from './ingoing/import-xml-dialog/import-xml-dialog.component';

@Component({
    selector: 'app-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {
    outgoingInvoicesAvailable = false;
    ingoingInvoicesAvailable = false;
    buttons: CustomButton[] = [
        {
            name: 'Nächste Rechnungsnummer setzen',
            navigate: (): void => {
                this.outgoingInvoiceNumberClicked();
            }
        },
        {
            name: 'Eingangsrechnungen importieren',
            navigate: (): void => {
                this.importIngoingInvoiceClicked();
            }
        }
    ];

    constructor(private authService: AuthService, private dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.authService.currentUserHasRight('outgoing_invoices:all').pipe(first()).subscribe(allowed => {
            this.outgoingInvoicesAvailable = allowed;
        });
        this.authService.currentUserHasRight('ingoing_invoices:all').pipe(first()).subscribe(allowed => {
            this.ingoingInvoicesAvailable = allowed;
        });
    }

    private outgoingInvoiceNumberClicked(): void {
        this.dialog.open(OutgoingInvoiceNumberDialogComponent, {
            width: '400px',
        });
    }

    private importIngoingInvoiceClicked() {
        this.dialog.open(ImportXmlDialogComponent, {
            width: '600px'
        });
    }
}

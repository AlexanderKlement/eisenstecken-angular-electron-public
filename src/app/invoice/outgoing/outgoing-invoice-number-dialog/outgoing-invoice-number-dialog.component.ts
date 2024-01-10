import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {DefaultService, ParameterCreate} from 'eisenstecken-openapi-angular-library';
import {first} from 'rxjs/operators';
import { MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-outgoing-invoice-number-dialog',
    templateUrl: './outgoing-invoice-number-dialog.component.html',
    styleUrls: ['./outgoing-invoice-number-dialog.component.scss']
})
export class OutgoingInvoiceNumberDialogComponent implements OnInit {

    outgoingInvoiceNumberFormGroup: UntypedFormGroup;

    constructor(public dialogRef: MatDialogRef<OutgoingInvoiceNumberDialogComponent>,
                private api: DefaultService) {
    }


    ngOnInit(): void {
        this.outgoingInvoiceNumberFormGroup = new UntypedFormGroup({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            invoice_number: new UntypedFormControl('')
        });
        this.api.getParameterParameterKeyGet('invoice_number').pipe(first()).subscribe((invoiceNumberString) => {
            this.outgoingInvoiceNumberFormGroup.get('invoice_number').setValue(invoiceNumberString);
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onSubmitClick() {
        const invoiceNumberParam: ParameterCreate = {
            value: this.outgoingInvoiceNumberFormGroup.get('invoice_number').value,
            key: 'invoice_number',
        };
        this.api.setParameterParameterPost(invoiceNumberParam).pipe(first()).subscribe(() => {
            this.dialogRef.close()
        });
    }
}

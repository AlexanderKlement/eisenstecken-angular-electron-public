import {Component, OnInit} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {first} from "rxjs/operators";
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultService, ParameterCreate} from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'app-outgoing-invoice-number-dialog',
    templateUrl: './outgoing-invoice-number-dialog.component.html',
    styleUrls: ['./outgoing-invoice-number-dialog.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class OutgoingInvoiceNumberDialogComponent implements OnInit {

    outgoingInvoiceNumberFormGroup: UntypedFormGroup;

    constructor(public dialogRef: MatDialogRef<OutgoingInvoiceNumberDialogComponent>,
                private api: DefaultService) {
    }


    ngOnInit(): void {
        this.outgoingInvoiceNumberFormGroup = new UntypedFormGroup({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            invoice_number: new UntypedFormControl("")
        });
        this.api.getParameterParameterKeyGet("invoice_number").pipe(first()).subscribe((invoiceNumberString) => {
            this.outgoingInvoiceNumberFormGroup.get("invoice_number").setValue(invoiceNumberString);
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onSubmitClick() {
        const invoiceNumberParam: ParameterCreate = {
            value: this.outgoingInvoiceNumberFormGroup.get("invoice_number").value,
            key: "invoice_number",
        };
        this.api.setParameterParameterPost(invoiceNumberParam).pipe(first()).subscribe(() => {
            this.dialogRef.close();
        });
    }
}

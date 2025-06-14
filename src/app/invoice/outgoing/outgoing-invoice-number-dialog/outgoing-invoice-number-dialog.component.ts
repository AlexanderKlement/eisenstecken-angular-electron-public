import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DefaultService, ParameterCreate } from '../../../../client/api';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-outgoing-invoice-number-dialog',
  templateUrl: './outgoing-invoice-number-dialog.component.html',
  styleUrls: ['./outgoing-invoice-number-dialog.component.scss'],
  imports: [
    MatDialogActions,
    MatFormField,
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatButton,
    MatLabel,
  ],
})
export class OutgoingInvoiceNumberDialogComponent implements OnInit {
  outgoingInvoiceNumberFormGroup: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<OutgoingInvoiceNumberDialogComponent>,
    private api: DefaultService
  ) {}

  ngOnInit(): void {
    this.outgoingInvoiceNumberFormGroup = new UntypedFormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invoice_number: new UntypedFormControl(''),
    });
    this.api
      .getParameterParameterKeyGet('invoice_number')
      .pipe(first())
      .subscribe(invoiceNumberString => {
        this.outgoingInvoiceNumberFormGroup
          .get('invoice_number')
          .setValue(invoiceNumberString);
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
    this.api
      .setParameterParameterPost(invoiceNumberParam)
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}

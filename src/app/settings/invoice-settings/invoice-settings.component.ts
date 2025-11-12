import { Component, OnInit } from '@angular/core';
import { BaseSettingsComponent } from '../base-settings.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultService } from '../../../api/openapi';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from 'ng-flex-layout';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-invoice-settings',
    templateUrl: './invoice-settings.component.html',
    styleUrls: ['./invoice-settings.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton]
})
export class InvoiceSettingsComponent extends BaseSettingsComponent implements OnInit {

  keyList = [
    'invoice_bank_1_name',
    'invoice_bank_1_iban',
    'invoice_bank_1_bic',
    'invoice_bank_2_name',
    'invoice_bank_2_iban',
    'invoice_bank_2_bic',
    'invoice_payment_condition_de',
    'invoice_payment_condition_it',
    'invoice_number',
  ];

  constructor(protected api: DefaultService, protected snackBar: MatSnackBar) {
    super(api, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}

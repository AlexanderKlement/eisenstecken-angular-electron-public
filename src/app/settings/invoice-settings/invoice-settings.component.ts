import { Component, OnInit } from '@angular/core';
import { BaseSettingsComponent } from '../base-settings.component';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { DefaultService } from '../../../api/openapi';

@Component({
  selector: 'app-invoice-settings',
  templateUrl: './invoice-settings.component.html',
  styleUrls: ['./invoice-settings.component.scss'],
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

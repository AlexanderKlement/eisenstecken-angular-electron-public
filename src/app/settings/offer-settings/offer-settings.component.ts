import { Component, OnInit } from '@angular/core';
import { BaseSettingsComponent } from '../base-settings.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DefaultService } from '../../../api/openapi';

@Component({
  selector: 'app-offer-settings',
  templateUrl: './offer-settings.component.html',
  styleUrls: ['./offer-settings.component.scss'],
})
export class OfferSettingsComponent extends BaseSettingsComponent implements OnInit {

  keyList = [
    'offer_title_introduction_de',
    'offer_title_introduction_it',
    'offer_in_price_included_de',
    'offer_in_price_included_it',
    'offer_validity_de',
    'offer_validity_it',
    'offer_delivery_de',
    'offer_delivery_it',
    'offer_payment_de',
    'offer_payment_it',
  ];


  constructor(protected api: DefaultService, protected snackBar: MatSnackBar) {
    super(api, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}

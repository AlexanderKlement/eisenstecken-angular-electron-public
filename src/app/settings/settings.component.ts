import { Component, OnInit } from "@angular/core";
import { ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import { OfferSettingsComponent } from "./offer-settings/offer-settings.component";
import { InvoiceSettingsComponent } from "./invoice-settings/invoice-settings.component";
import { DeliverySettingsComponent } from "./delivery-settings/delivery-settings.component";
import { OrderSettingsComponent } from "./order-settings/order-settings.component";
import { ReminderSettingsComponent } from "./reminder-settings/reminder-settings.component";
import { InfoSettingsComponent } from "./info-settings/info-settings.component";
import { InfoPageSettingsComponent } from "./info-page-settings/info-page-settings.component";

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    imports: [ToolbarComponent, MatTabGroup, MatTab, GeneralSettingsComponent, OfferSettingsComponent, InvoiceSettingsComponent, DeliverySettingsComponent, OrderSettingsComponent, ReminderSettingsComponent, InfoSettingsComponent, InfoPageSettingsComponent]
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}

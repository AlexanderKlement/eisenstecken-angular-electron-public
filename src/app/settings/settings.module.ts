import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";
import {SharedModule} from "../shared/shared.module";
import {SettingsComponent} from "./settings.component";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import { OfferSettingsComponent } from "./offer-settings/offer-settings.component";
import { InvoiceSettingsComponent } from "./invoice-settings/invoice-settings.component";
import { DeliverySettingsComponent } from "./delivery-settings/delivery-settings.component";
import { OrderSettingsComponent } from "./order-settings/order-settings.component";
import { ReminderSettingsComponent } from "./reminder-settings/reminder-settings.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import { InfoSettingsComponent } from "./info-settings/info-settings.component";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatIconModule} from "@angular/material/icon";
import { InfoPageSettingsComponent } from "./info-page-settings/info-page-settings.component";
// eslint-disable-next-line max-len
import { InfoPageSettingEditDialogComponent } from "./info-page-settings/info-page-setting-edit-dialog/info-page-setting-edit-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import { FlexModule } from "ng-flex-layout";


@NgModule({
  declarations: [
    SettingsComponent,
    OfferSettingsComponent,
    InvoiceSettingsComponent,
    DeliverySettingsComponent,
    OrderSettingsComponent,
    ReminderSettingsComponent,
    GeneralSettingsComponent,
    InfoSettingsComponent,
    InfoPageSettingsComponent,
    InfoPageSettingEditDialogComponent,
  ],
    imports: [
        CommonModule,
        SharedModule,
        MatTabsModule,
        ReactiveFormsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatListModule,
        MatIconModule,
        MatDialogModule
    ]
})
export class SettingsModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SettingsRoutingModule } from "./settings-routing.module";
import {SharedModule} from "../shared/shared.module";
import {SettingsComponent} from "./settings.component";
import {MatTabsModule} from "@angular/material/tabs";
import { OfferSettingsComponent } from "./offer-settings/offer-settings.component";
import { InvoiceSettingsComponent } from "./invoice-settings/invoice-settings.component";
import { DeliverySettingsComponent } from "./delivery-settings/delivery-settings.component";
import { OrderSettingsComponent } from "./order-settings/order-settings.component";
import { ReminderSettingsComponent } from "./reminder-settings/reminder-settings.component";
import { GeneralSettingsComponent } from "./general-settings/general-settings.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import { InfoSettingsComponent } from "./info-settings/info-settings.component";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import { InfoPageSettingsComponent } from "./info-page-settings/info-page-settings.component";
// eslint-disable-next-line max-len
import { InfoPageSettingEditDialogComponent } from "./info-page-settings/info-page-setting-edit-dialog/info-page-setting-edit-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import { FlexModule } from "ng-flex-layout";


@NgModule({
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
        MatDialogModule,
        SettingsComponent,
        OfferSettingsComponent,
        InvoiceSettingsComponent,
        DeliverySettingsComponent,
        OrderSettingsComponent,
        ReminderSettingsComponent,
        GeneralSettingsComponent,
        InfoSettingsComponent,
        InfoPageSettingsComponent,
        InfoPageSettingEditDialogComponent
    ]
})
export class SettingsModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MobileAppRoutingModule } from "./mobile-app-routing.module";
import { MobileAppComponent } from "./mobile-app.component";
import {SharedModule} from "../shared/shared.module";
import {FlexModule} from "ng-flex-layout";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import { HoursComponent } from "./hours/hours.component";
import {MatStepperModule} from "@angular/material/stepper";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import { HoursSummaryComponent } from "./hours/hours-summary/hours-summary.component";
import { HoursStepperComponent } from "./hours/hours-stepper/hours-stepper.component";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import { RedirectComponent } from "./hours/redirect/redirect.component";
import { HoursStepperJobDialogComponent } from "./hours/hours-stepper/hours-stepper-job-dialog/hours-stepper-job-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import { HoursStepperDriveDialogComponent } from "./hours/hours-stepper/hours-stepper-drive-dialog/hours-stepper-drive-dialog.component";


@NgModule({
    declarations: [
        MobileAppComponent,
        HoursComponent,
        HoursSummaryComponent,
        HoursStepperComponent,
        RedirectComponent,
        HoursStepperJobDialogComponent,
        HoursStepperDriveDialogComponent
    ],
    exports: [
        HoursStepperComponent
    ],
    imports: [
        CommonModule,
        MobileAppRoutingModule,
        SharedModule,
        FlexModule,
        MatButtonModule,
        MatStepperModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule
    ]
})
export class MobileAppModule { }

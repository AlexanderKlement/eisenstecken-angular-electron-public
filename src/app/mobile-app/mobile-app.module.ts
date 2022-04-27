import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAppRoutingModule } from './mobile-app-routing.module';
import { MobileAppComponent } from './mobile-app.component';
import {SharedModule} from '../shared/shared.module';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import { HoursComponent } from './hours/hours.component';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { HoursSummaryComponent } from './hours/hours-summary/hours-summary.component';
import { HoursStepperComponent } from './hours/hours-stepper/hours-stepper.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    MobileAppComponent,
    HoursComponent,
    HoursSummaryComponent,
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
    MatProgressSpinnerModule
  ]
})
export class MobileAppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeRoutingModule } from './employee-routing.module';
import { EmployeeComponent } from './employee.component';
import {SharedModule} from '../shared/shared.module';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import {MatLegacyTabsModule as MatTabsModule} from '@angular/material/legacy-tabs';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import { WorkDayNewComponent } from './work-day-new/work-day-new.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {FlexModule} from 'ng-flex-layout';
import { MealComponent } from './meal/meal.component';
import { EmployeeServiceComponent } from './service/employee-service.component';
import { ServiceDialogComponent } from './service/service-dialog/service-dialog.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { ServiceCreateDialogComponent } from './service/service-create-dialog/service-create-dialog.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {ReactiveFormsModule} from '@angular/forms';
import {MobileAppModule} from '../mobile-app/mobile-app.module';
import { EmployeeRedirectComponent } from './employee-redirect/employee-redirect.component';


@NgModule({
  declarations: [
    EmployeeComponent,
    EmployeeDetailComponent,
    WorkDayNewComponent,
    MealComponent,
    EmployeeServiceComponent,
    ServiceDialogComponent,
    ServiceCreateDialogComponent,
    EmployeeRedirectComponent
  ],
    imports: [
        CommonModule,
        EmployeeRoutingModule,
        SharedModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        FlexModule,
        MatDialogModule,
        MatButtonModule,
        MatDatepickerModule,
        MatInputModule,
        ReactiveFormsModule,
        MobileAppModule
    ]
})
export class EmployeeModule { }

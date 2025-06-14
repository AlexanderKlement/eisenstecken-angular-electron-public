import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobRoutingModule } from './job-routing.module';
import { JobComponent } from './job.component';
import { SharedModule } from '../shared/shared.module';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { JobEditComponent } from './job-edit/job-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { JobStatusBarComponent } from './job-detail/job-status-bar/job-status-bar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OfferEditComponent } from './offer-edit/offer-edit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { OutgoingInvoiceEditComponent } from './outgoing-invoice-edit/outgoing-invoice-edit.component';
import { WorkHoursComponent } from './work-hours/work-hours.component';
import { WorkHourEditDialogComponent } from './work-hours/work-hour-edit-dialog/work-hour-edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderPrintDialogComponent } from './job-detail/order-print-dialog/order-print-dialog.component';
import { MatListModule } from '@angular/material/list';
import { ChangePathDialogComponent } from './job-detail/change-path-dialog/change-path-dialog.component';
import { MoveJobDialogComponent } from './job-detail/move-job-dialog/move-job-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    JobRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatDialogModule,
    MatTabsModule,
    MatListModule,
    JobComponent,
    JobDetailComponent,
    JobEditComponent,
    JobStatusBarComponent,
    OfferEditComponent,
    OutgoingInvoiceEditComponent,
    WorkHoursComponent,
    WorkHourEditDialogComponent,
    OrderPrintDialogComponent,
    ChangePathDialogComponent,
    MoveJobDialogComponent,
  ],
  exports: [JobStatusBarComponent],
})
export class JobModule {}

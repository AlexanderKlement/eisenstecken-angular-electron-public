import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageNotFoundComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestComponent } from './components/test/test.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableBuilderComponent } from './components/table-builder/table-builder.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { InfoBuilderComponent } from './components/info-builder/info-builder.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { LockDialogComponent } from './components/info-builder/lock-dialog/lock-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BaseEditComponent } from './components/base-edit/base-edit.component';
import { WarningDialogComponent } from './components/base-edit/warning-dialog/warning-dialog.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { MatSelectModule } from '@angular/material/select';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SimpleCalendarComponent } from './components/calendar/simple-calendar.component';
import { CalendarEditComponent } from './components/calendar/calendar-edit/calendar-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CalendarDayComponent } from './components/calendar/calendar-day/calendar-day.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterableClickableListComponent } from './components/filterable-clickable-list/filterable-clickable-list.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MatCardModule } from '@angular/material/card';
import { RightFilterPipe } from './pipes/right';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MinuteHourComponent } from './components/minute-hour/minute-hour.component';
import { SplitTextNewlinePipe } from './pipes/common';
import { BoldSpanPipe } from './pipes/boldSearchResult';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarModule } from 'angular-calendar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatCheckboxModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule,
    MatIconModule,
    MatDatepickerModule,
    MatTabsModule,
    MatCardModule,
    //NgxMaterialTimepickerModule.setLocale('de-DE'),
    MatTooltipModule,
    CalendarModule,
    //NgxMatDatetimePickerModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    PageNotFoundComponent,
    WebviewDirective,
    TestComponent,
    TableBuilderComponent,
    InfoBuilderComponent,
    LockDialogComponent,
    BaseEditComponent,
    WarningDialogComponent,
    AddressFormComponent,
    ToolbarComponent,
    SimpleCalendarComponent,
    CalendarEditComponent,
    CalendarDayComponent,
    FilterableClickableListComponent,
    LoadingComponent,
    RightFilterPipe,
    BoldSpanPipe,
    SplitTextNewlinePipe,
    ConfirmDialogComponent,
    MinuteHourComponent,
  ],
  exports: [
    TranslateModule,
    WebviewDirective,
    FormsModule,
    TestComponent,
    TableBuilderComponent,
    InfoBuilderComponent,
    AddressFormComponent,
    ToolbarComponent,
    SimpleCalendarComponent,
    FilterableClickableListComponent,
    LoadingComponent,
    RightFilterPipe,
    BoldSpanPipe,
    SplitTextNewlinePipe,
    MinuteHourComponent,
  ],
})
export class SharedModule {}

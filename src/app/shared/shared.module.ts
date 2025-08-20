import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {PageNotFoundComponent} from "./components/";
import {WebviewDirective} from "./directives/";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TestComponent} from "./components/test/test.component";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {TableBuilderComponent} from "./components/table-builder/table-builder.component";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyPaginatorModule as MatPaginatorModule} from "@angular/material/legacy-paginator";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {InfoBuilderComponent} from "./components/info-builder/info-builder.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {LockDialogComponent} from "./components/info-builder/lock-dialog/lock-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {BaseEditComponent} from "./components/base-edit/base-edit.component";
import {WarningDialogComponent} from "./components/base-edit/warning-dialog/warning-dialog.component";
import {AddressFormComponent} from "./components/address-form/address-form.component";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {ToolbarComponent} from "./components/toolbar/toolbar.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import {SimpleCalendarComponent} from "./components/calendar/simple-calendar.component";
import {CalendarEditComponent} from "./components/calendar/calendar-edit/calendar-edit.component";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CalendarDayComponent} from "./components/calendar/calendar-day/calendar-day.component";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {
  FilterableClickableListComponent
} from "./components/filterable-clickable-list/filterable-clickable-list.component";
import {LoadingComponent} from "./components/loading/loading.component";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {RightFilterPipe} from "./pipes/right";
import {ConfirmDialogComponent} from "./components/confirm-dialog/confirm-dialog.component";
import {MinuteHourComponent} from "./components/minute-hour/minute-hour.component";
import {SplitTextNewlinePipe} from "./pipes/common";
import {BoldSpanPipe} from "./pipes/boldSearchResult";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {CalendarModule} from "angular-calendar";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatLegacySlideToggleModule as MatSlideToggleModule} from "@angular/material/legacy-slide-toggle";
import { FlexLayoutModule, FlexModule } from "ng-flex-layout";

@NgModule({
  declarations: [
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
    MinuteHourComponent
  ],
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
    FlexModule,
    MatSelectModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatDatepickerModule,
    MatTabsModule,
    MatCardModule,
    NgxMaterialTimepickerModule.setLocale('de-DE'),
    MatTooltipModule,
    CalendarModule,
    MatButtonToggleModule,
    MatSlideToggleModule
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
    MinuteHourComponent]
})
export class SharedModule {
}

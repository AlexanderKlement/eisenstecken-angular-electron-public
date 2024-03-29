import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { HomeRoutingModule } from './home/home-routing.module';
import { LoginRoutingModule } from './login/login-routing.module';
import { HomeComponent } from './home/home.component';
import { ClientRoutingModule } from './client/client-routing.module';
import { JobRoutingModule } from './job/job-routing.module';
import { UserRoutingModule } from './user/user-routing.module';
import { InvoiceRoutingModule } from './invoice/invoice-routing.module';
import { SupplierRoutingModule } from './supplier/supplier-routing.module';
import { OrderRoutingModule } from './order/order-routing.module';
import { SettingsRoutingModule } from './settings/settings-routing.module';
import { RecalculationRoutingModule } from './recalculation/recalculation-routing.module';
import { EmployeeRoutingModule } from './employee/employee-routing.module';
import { AccessGuard } from './shared/services/access-guard.service';
import { DeliveryNoteRoutingModule } from './delivery-note/delivery-note-routing.module';
import { DebugRoutingModule } from './debug/debug-routing.module';
import { EventCalendarRoutingModule } from './calendar/event-calendar-routing.module';
import { MobileAppRoutingModule } from './mobile-app/mobile-app-routing.module';
import { ServiceRoutingModule } from './service/service-routing.module';
import { PhoneBookRoutingModule } from './phone-book/phone-book-routing.module';

const routes: Routes = [
  {
    path: '',
    //redirectTo: 'home',
    component: HomeComponent,
    //pathMatch: 'full',
    data: {
      requiresLogin: true,
      shouldDetach: true,
    },
    canActivate: [AccessGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
    HomeRoutingModule,
    LoginRoutingModule,
    ClientRoutingModule,
    JobRoutingModule,
    RecalculationRoutingModule,
    OrderRoutingModule,
    SettingsRoutingModule,
    MobileAppRoutingModule,
    InvoiceRoutingModule,
    UserRoutingModule,
    SupplierRoutingModule,
    EventCalendarRoutingModule,
    DebugRoutingModule,
    EmployeeRoutingModule,
    DeliveryNoteRoutingModule,
    ServiceRoutingModule,
    PhoneBookRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

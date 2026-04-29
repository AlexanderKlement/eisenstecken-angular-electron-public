import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { AccessGuard } from "./shared/services/access-guard.service";

import supplierRoutes from "./supplier/supplier-routes";
import jobRoutes from "./job/job-routes";
import userRoutes from "./user/user-routes";
import clientRoutes from "./client/client-routes";
import recalculationRoutes from "./recalculation/recalculation-routes";
import orderRoutes from "./order/order-routes";
import settingsRoutes from "./settings/settings-routes";
import mobileAppRoutes from "./mobile-app/mobile-app-routes";
import invoiceRoutes from "./invoice/invoice-routes";
import eventCalendarRoutes from "./calendar/event-calendar-routes";
import debugRoutes from "./debug/debug-routes";
import employeeRoutes from "./employee/employee-routes";
import deliveryNotesRoutes from "./delivery-note/delivery-note-routes";
import serviceRoutes from "./service/service-routes";
import phoneBookRoutes from "./phone-book/phone-book-routes";


export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "home",
    component: HomeComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "login",
    loadComponent: () => import("./login/login.component"),
    data: { requiresLogin: false }
  },
  ...userRoutes,
  ...jobRoutes,
  ...supplierRoutes,
  ...clientRoutes,
  ...recalculationRoutes,
  ...orderRoutes,
  ...settingsRoutes,
  ...mobileAppRoutes,
  ...invoiceRoutes,
  ...eventCalendarRoutes,
  ...debugRoutes,
  ...employeeRoutes,
  ...deliveryNotesRoutes,
  ...serviceRoutes,
  ...phoneBookRoutes,
  {
    path: "**",
    loadComponent: () => import("./shared/components/page-not-found/page-not-found.component")
  }
];

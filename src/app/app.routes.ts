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
import invoiceRoutes from "./invoice/invoice-routes";
import debugRoutes from "./debug/debug-routes";
import deliveryNotesRoutes from "./delivery-note/delivery-note-routes";
import phoneBookRoutes from "./phone-book/phone-book-routes";
import LoginComponent from "./login/login.component";
import { PageNotFoundComponent } from "./shared/components";
import offerV2Routes from "./offer-v2/offer-v2-routes";


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
    component: LoginComponent,
    data: { requiresLogin: false }
  },
  ...offerV2Routes,
  ...userRoutes,
  ...jobRoutes,
  ...supplierRoutes,
  ...clientRoutes,
  ...recalculationRoutes,
  ...orderRoutes,
  ...settingsRoutes,
  ...invoiceRoutes,
  ...debugRoutes,
  ...deliveryNotesRoutes,
  ...phoneBookRoutes,
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

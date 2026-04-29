import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const invoiceRoutes: Routes = [
  {
    path: "invoice",
    loadComponent: () => import("./invoice.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "invoice/ingoing/:id",
    loadComponent: () => import("./ingoing/ingoing-detail/ingoing-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  }
];

export default invoiceRoutes;

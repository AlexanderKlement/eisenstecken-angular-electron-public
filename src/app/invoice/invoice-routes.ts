import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import InvoiceComponent from "./invoice.component";
import IngoingDetailComponent from "./ingoing/ingoing-detail/ingoing-detail.component";

const invoiceRoutes: Routes = [
  {
    path: "invoice",
    component: InvoiceComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "invoice/ingoing/:id",
    component: IngoingDetailComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  }
];

export default invoiceRoutes;

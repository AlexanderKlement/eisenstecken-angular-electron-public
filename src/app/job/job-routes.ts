import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import { DirtyFormGuard } from "../shared/guards/dirty-form.guard";
import JobComponent from "./job.component";
import JobDetailComponent from "./job-detail/job-detail.component";
import JobEditComponent from "./job-edit/job-edit.component";
import OfferEditComponent from "./offer-edit/offer-edit.component";
import OutgoingInvoiceEditComponent from "./outgoing-invoice-edit/outgoing-invoice-edit.component";
import WorkHoursComponent from "./work-hours/work-hours.component";

const jobRoutes: Routes = [
  {
    path: "job",
    component: JobComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "job/:id",
    component: JobDetailComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id",
    component: JobEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "job/:id/new",
    component: JobEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id/:client_id",
    component: JobEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id/:job_id/:sub",
    component: JobEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "offer/edit/:id",
    component: OfferEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "offer/edit/:id/:job_id",
    component: OfferEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "outgoing_invoice/edit/:id",
    component: OutgoingInvoiceEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "outgoing_invoice/edit/:id/:job_id",
    component: OutgoingInvoiceEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "work_hours/:job_id",
    component: WorkHoursComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  }
];

export default jobRoutes;

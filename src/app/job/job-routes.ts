import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import { DirtyFormGuard } from "../shared/guards/dirty-form.guard";

const jobRoutes: Routes = [
  {
    path: "job",
    loadComponent: () => import("./job.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "job/:id",
    loadComponent: () => import("./job-detail/job-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id",
    loadComponent: () => import("./job-edit/job-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "job/:id/new",
    loadComponent: () => import("./job-edit/job-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id/:client_id",
    loadComponent: () => import("./job-edit/job-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "job/edit/:id/:job_id/:sub",
    loadComponent: () => import("./job-edit/job-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "offer/edit/:id",
    loadComponent: () => import("./offer-edit/offer-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "offer/edit/:id/:job_id",
    loadComponent: () => import("./offer-edit/offer-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "outgoing_invoice/edit/:id",
    loadComponent: () => import("./outgoing-invoice-edit/outgoing-invoice-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "outgoing_invoice/edit/:id/:job_id",
    loadComponent: () => import("./outgoing-invoice-edit/outgoing-invoice-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard],
    canDeactivate: [DirtyFormGuard]
  },
  {
    path: "work_hours/:job_id",
    loadComponent: () => import("./work-hours/work-hours.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  }
];

export default jobRoutes;

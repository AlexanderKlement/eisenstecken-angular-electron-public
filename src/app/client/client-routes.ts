import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const clientRoutes: Routes = [
  {
    path: "client",
    loadComponent: () => import("./client.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "client/:id",
    loadComponent: () => import("./client-detail/client-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "client/edit/:id",
    loadComponent: () => import("./client-edit/client-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default clientRoutes;

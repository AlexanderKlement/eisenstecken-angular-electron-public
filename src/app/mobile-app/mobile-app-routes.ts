import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const mobileAppRoutes: Routes = [
  {
    path: "mobile",
    loadComponent: () => import("./mobile-app.component"),
    data: {
      requiresLogin: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "mobile/hours",
    loadComponent: () => import("./hours/hours.component"),
    data: {
      requiresLogin: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "mobile/hours/redirect",
    loadComponent: () => import("./hours/redirect/redirect.component"),
    data: {
      requiresLogin: true
    },
    canActivate: [AccessGuard]
  }
];

export default mobileAppRoutes;

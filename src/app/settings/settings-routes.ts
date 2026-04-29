import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const settingsRoutes: Routes = [
  {
    path: "settings",
    loadComponent: () => import("./settings.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default settingsRoutes;

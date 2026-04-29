import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const serviceRoutes: Routes = [{
  path: "service",
  loadComponent: () => import("./service.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}];

export default serviceRoutes;

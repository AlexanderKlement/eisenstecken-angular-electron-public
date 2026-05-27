import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import ServiceComponent from "./service.component";

const serviceRoutes: Routes = [{
  path: "service",
  component: ServiceComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}];

export default serviceRoutes;

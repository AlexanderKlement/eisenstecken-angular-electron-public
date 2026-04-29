import { Routes } from "@angular/router";

const debugRoutes: Routes = [{
  path: "debug",
  loadComponent: () => import("./debug.component"),
  data: { requiresLogin: true }
}];

export default debugRoutes;

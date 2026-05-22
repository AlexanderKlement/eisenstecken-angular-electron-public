import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const testRoutes: Routes = [{
  path: "test",
  loadComponent: () => import("./test.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/offer/:job_id",
  loadComponent: () => import("./test.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/fields",
  loadComponent: () => import("./fields/offer-fields.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/fields/:id",
  loadComponent: () => import("./fields/fields-edit/offer-fields-edit.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/element_types",
  loadComponent: () => import("./element_types/offer-element-types.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/libraries",
  loadComponent: () => import("./libraries/offer-libraries.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "test/templates",
  loadComponent: () => import("./templates/offer-templates.component"),
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}];

export default testRoutes;

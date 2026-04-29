import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const orderRoutes: Routes = [
  {
    path: "order",
    loadComponent: () => import("./order.component"),
    data: {
      requiresLogin: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "order/:id",
    loadComponent: () => import("./order-detail/order-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "order_bundle/:id",
    loadComponent: () => import("./order-bundle-detail/order-bundle-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "order_bundle/edit/:id",
    loadComponent: () => import("./order-bundle-edit/order-bundle-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default orderRoutes;

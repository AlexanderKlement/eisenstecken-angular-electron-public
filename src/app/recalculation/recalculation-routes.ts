import { Routes } from "@angular/router";

const recalculationRoutes: Routes = [
  {
    path: "recalculation",
    loadComponent: () => import("./recalculation.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "recalculation/:id",
    loadComponent: () => import("./recalculation-detail/recalculation-detail.component"),
    data: {
      requiresLogin: true
    }
  },
  {
    path: "recalculation/edit/:id",
    loadComponent: () => import("./recalculation-edit/recalculation-edit.component"),
    data: { requiresLogin: true }
  },
  {
    path: "paint-template",
    loadComponent: () => import("./paint-template/paint-template.component"),
    data: { requiresLogin: true }
  }
];

export default recalculationRoutes;

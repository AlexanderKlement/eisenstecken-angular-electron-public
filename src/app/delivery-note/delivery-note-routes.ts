import { Routes } from "@angular/router";

const deliveryNotesRoutes: Routes = [
  {
    path: "delivery_note",
    loadComponent: () => import("./delivery-note.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "delivery_note/:id",
    loadComponent: () => import("./delivery-edit/delivery-edit.component"),
    data: { requiresLogin: true }
  }
];

export default deliveryNotesRoutes;

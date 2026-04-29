import { Routes } from "@angular/router";


const phoneBookRoutes: Routes = [
  {
    path: "phone_book",
    loadComponent: () => import("./phone-book.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  }
];

export default phoneBookRoutes;

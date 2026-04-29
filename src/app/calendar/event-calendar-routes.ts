import { Routes } from "@angular/router";

const eventCalendarRoutes: Routes = [
  {
    path: "calendar",
    loadComponent: () => import("./event-calendar.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  }
];

export default eventCalendarRoutes;

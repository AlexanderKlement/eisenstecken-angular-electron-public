import { Routes } from "@angular/router";
import EventCalendarComponent from "./event-calendar.component";

const eventCalendarRoutes: Routes = [
  {
    path: "calendar",
    component: EventCalendarComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  }
];

export default eventCalendarRoutes;

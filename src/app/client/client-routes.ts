import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import ClientComponent from "./client.component";
import ClientDetailComponent from "./client-detail/client-detail.component";
import ClientEditComponent from "./client-edit/client-edit.component";

const clientRoutes: Routes = [
  {
    path: "client",
    component: ClientComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "client/:id",
    component: ClientDetailComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    },
    canActivate: [AccessGuard]
  },
  {
    path: "client/edit/:id",
    component: ClientEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default clientRoutes;

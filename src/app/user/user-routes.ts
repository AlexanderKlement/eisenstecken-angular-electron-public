import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";

const userRoutes: Routes = [
  {
    path: "user",
    loadComponent: () => import("./user.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "user/edit/:id",
    loadComponent: () => import("./user-edit/user-edit.component"),
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default userRoutes;

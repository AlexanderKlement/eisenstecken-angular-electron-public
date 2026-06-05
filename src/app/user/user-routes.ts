import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import UserComponent from "./user.component";
import UserEditComponent from "./user-edit/user-edit.component";

const userRoutes: Routes = [
  {
    path: "user",
    component: UserComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  },
  {
    path: "user/edit/:id",
    component: UserEditComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default userRoutes;

import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import SettingsComponent from "./settings.component";

const settingsRoutes: Routes = [
  {
    path: "settings",
    component: SettingsComponent,
    data: { requiresLogin: true },
    canActivate: [AccessGuard]
  }
];

export default settingsRoutes;

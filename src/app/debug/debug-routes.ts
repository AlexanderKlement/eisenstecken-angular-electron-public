import { Routes } from "@angular/router";
import DebugComponent from "./debug.component";

const debugRoutes: Routes = [{
  path: "debug",
  component: DebugComponent,
  data: { requiresLogin: true }
}];

export default debugRoutes;

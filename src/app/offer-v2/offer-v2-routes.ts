import { Routes } from "@angular/router";
import { AccessGuard } from "../shared/services/access-guard.service";
import OfferTemplatesComponent from "./templates/offer-templates.component";
import OfferLibrariesComponent from "./libraries/offer-libraries.component";
import OfferElementTypesComponent from "./element-types/offer-element-types.component";
import OfferFieldsComponent from "./fields/offer-fields.component";
import OfferV2Component from "./offer-v2.component";
import OfferUnitsComponent from "./units/offer-units.component";
import OfferElementTypesEditComponent from "./element-types/element-types-edit/offer-element-types-edit.component";

const offerV2Routes: Routes = [{
  path: "offer_v2",
  component: OfferV2Component,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/offer/:job_id",
  component: OfferV2Component,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/fields",
  component: OfferFieldsComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/element_types",
  component: OfferElementTypesComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/element_types/:id",
  component: OfferElementTypesEditComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/element_types/:id/:method",
  component: OfferElementTypesEditComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/libraries",
  component: OfferLibrariesComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/units",
  component: OfferUnitsComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}, {
  path: "offer_v2/templates",
  component: OfferTemplatesComponent,
  data: {
    requiresLogin: true
  },
  canActivate: [AccessGuard]
}];

export default offerV2Routes;

import { Routes } from "@angular/router";
import DeliveryNoteComponent from "./delivery-note.component";
import DeliveryEditComponent from "./delivery-edit/delivery-edit.component";

const deliveryNotesRoutes: Routes = [
  {
    path: "delivery_note",
    component: DeliveryNoteComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "delivery_note/:id",
    component: DeliveryEditComponent,
    data: { requiresLogin: true }
  }
];

export default deliveryNotesRoutes;

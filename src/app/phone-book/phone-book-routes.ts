import { Routes } from "@angular/router";
import PhoneBookComponent from "./phone-book.component";


const phoneBookRoutes: Routes = [
  {
    path: "phone_book",
    component: PhoneBookComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  }
];

export default phoneBookRoutes;

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import {SharedModule} from "../shared/shared.module";
import {FlexModule} from "ng-flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {LoginComponent} from "./login.component";
import {LoginRoutingModule} from "./login-routing.module";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    SharedModule,
    FlexModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatCheckboxModule
  ]
})
export class LoginModule { }

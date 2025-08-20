import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UserRoutingModule } from "./user-routing.module";
import { UserComponent } from "./user.component";
import {SharedModule} from "../shared/shared.module";
import { UserEditComponent } from "./user-edit/user-edit.component";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import { FlexModule } from "ng-flex-layout";


@NgModule({
  declarations: [
    UserComponent,
    UserEditComponent
  ],
    imports: [
        CommonModule,
        UserRoutingModule,
        SharedModule,
        MatTabsModule,
        FlexModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatCheckboxModule
    ]
})
export class UserModule { }

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ClientRoutingModule } from "./client-routing.module";
import { ClientComponent } from "./client.component";
import {SharedModule} from "../shared/shared.module";
import {ClientEditComponent} from "./client-edit/client-edit.component";
import {ClientDetailComponent} from "./client-detail/client-detail.component";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FlexModule} from "ng-flex-layout";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatIconModule} from "@angular/material/icon";


@NgModule({
  declarations: [
    ClientComponent,
    ClientEditComponent,
    ClientDetailComponent
  ],
    imports: [
        CommonModule,
        ClientRoutingModule,
        SharedModule,
        MatCheckboxModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        FlexModule,
        MatButtonModule,
        MatTabsModule,
        MatIconModule,
    ]
})
export class ClientModule { }

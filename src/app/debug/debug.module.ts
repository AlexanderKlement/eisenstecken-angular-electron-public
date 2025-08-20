import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DebugRoutingModule } from "./debug-routing.module";
import { DebugComponent } from "./debug.component";
import {FlexModule} from "ng-flex-layout";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    DebugComponent
  ],
    imports: [
        CommonModule,
        DebugRoutingModule,
        FlexModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        SharedModule
    ]
})
export class DebugModule { }

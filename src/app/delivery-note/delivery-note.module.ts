import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DeliveryNoteRoutingModule } from "./delivery-note-routing.module";
import { DeliveryNoteComponent } from "./delivery-note.component";
import {SharedModule} from "../shared/shared.module";
import { DeliveryEditComponent } from "./delivery-edit/delivery-edit.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "ng-flex-layout";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatLegacyOptionModule as MatOptionModule} from "@angular/material/legacy-core";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";


@NgModule({
  declarations: [
    DeliveryNoteComponent,
    DeliveryEditComponent
  ],
    imports: [
        CommonModule,
        DeliveryNoteRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        FlexModule,
        MatDatepickerModule,
        MatOptionModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule
    ]
})
export class DeliveryNoteModule { }

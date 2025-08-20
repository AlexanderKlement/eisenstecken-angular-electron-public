import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RecalculationRoutingModule } from "./recalculation-routing.module";
import { RecalculationComponent } from "./recalculation.component";
import {SharedModule} from "../shared/shared.module";
import { RecalculationDetailComponent } from "./recalculation-detail/recalculation-detail.component";
import { RecalculationEditComponent } from "./recalculation-edit/recalculation-edit.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatIconModule} from "@angular/material/icon";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import { PaintTemplateComponent } from "./paint-template/paint-template.component";
import { PaintTemplateEditDialogComponent } from "./paint-template/paint-template-edit-dialog/paint-template-edit-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import { FlexModule } from "ng-flex-layout";


@NgModule({
  declarations: [
    RecalculationComponent,
    RecalculationDetailComponent,
    RecalculationEditComponent,
    PaintTemplateComponent,
    PaintTemplateEditDialogComponent
  ],
    imports: [
        CommonModule,
        RecalculationRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FlexModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatDialogModule,
        MatListModule
    ]
})
export class RecalculationModule { }

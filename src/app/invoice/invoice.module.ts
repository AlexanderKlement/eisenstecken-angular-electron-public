import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InvoiceRoutingModule } from "./invoice-routing.module";
import { InvoiceComponent } from "./invoice.component";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import { IngoingComponent } from "./ingoing/ingoing.component";
import { OutgoingComponent } from "./outgoing/outgoing.component";
import { OutgoingInvoiceNumberDialogComponent } from "./outgoing/outgoing-invoice-number-dialog/outgoing-invoice-number-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {FlexModule} from "ng-flex-layout";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import { ImportXmlDialogComponent } from "./ingoing/import-xml-dialog/import-xml-dialog.component";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatIconModule} from "@angular/material/icon";
import { IngoingDetailComponent } from "./ingoing/ingoing-detail/ingoing-detail.component";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";


@NgModule({
  declarations: [
    InvoiceComponent,
    IngoingComponent,
    OutgoingComponent,
    OutgoingInvoiceNumberDialogComponent,
    ImportXmlDialogComponent,
    IngoingDetailComponent
  ],
    imports: [
        CommonModule,
        InvoiceRoutingModule,
        SharedModule,
        MatTabsModule,
        MatDialogModule,
        MatButtonModule,
        FlexModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatListModule,
        MatIconModule,
        MatSelectModule
    ]
})
export class InvoiceModule { }

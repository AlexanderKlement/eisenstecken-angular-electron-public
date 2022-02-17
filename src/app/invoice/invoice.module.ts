import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';
import {SharedModule} from '../shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs';
import { IngoingComponent } from './ingoing/ingoing.component';
import { OutgoingComponent } from './outgoing/outgoing.component';
import { OutgoingInvoiceNumberDialogComponent } from './outgoing/outgoing-invoice-number-dialog/outgoing-invoice-number-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FlexModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { ImportXmlDialogComponent } from './ingoing/import-xml-dialog/import-xml-dialog.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { IngoingDetailComponent } from './ingoing/ingoing-detail/ingoing-detail.component';


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
        MatIconModule
    ]
})
export class InvoiceModule { }

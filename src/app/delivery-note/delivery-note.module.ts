import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNoteRoutingModule } from './delivery-note-routing.module';
import { DeliveryNoteComponent } from './delivery-note.component';
import { SharedModule } from '../shared/shared.module';
import { DeliveryEditComponent } from './delivery-edit/delivery-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    DeliveryNoteRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatDatepickerModule,
    MatOptionModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    DeliveryNoteComponent,
    DeliveryEditComponent,
  ],
})
export class DeliveryNoteModule {}

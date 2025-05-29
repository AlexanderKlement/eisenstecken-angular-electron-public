import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecalculationRoutingModule } from './recalculation-routing.module';
import { RecalculationComponent } from './recalculation.component';
import { SharedModule } from '../shared/shared.module';
import { RecalculationDetailComponent } from './recalculation-detail/recalculation-detail.component';
import { RecalculationEditComponent } from './recalculation-edit/recalculation-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PaintTemplateComponent } from './paint-template/paint-template.component';
import { PaintTemplateEditDialogComponent } from './paint-template/paint-template-edit-dialog/paint-template-edit-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    RecalculationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatListModule,
    RecalculationComponent,
    RecalculationDetailComponent,
    RecalculationEditComponent,
    PaintTemplateComponent,
    PaintTemplateEditDialogComponent,
  ],
})
export class RecalculationModule {}

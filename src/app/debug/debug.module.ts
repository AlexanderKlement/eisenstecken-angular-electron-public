import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebugRoutingModule } from './debug-routing.module';
import { DebugComponent } from './debug.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DebugRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    SharedModule,
    DebugComponent,
  ],
})
export class DebugModule {}

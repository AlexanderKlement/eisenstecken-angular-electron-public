import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { SharedModule } from '../shared/shared.module';
import { ClientEditComponent } from './client-edit/client-edit.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    ClientComponent,
    ClientEditComponent,
    ClientDetailComponent,
  ],
})
export class ClientModule {}

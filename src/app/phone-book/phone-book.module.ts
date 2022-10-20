import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PhoneBookRoutingModule } from './phone-book-routing.module';
import { PhoneBookComponent } from './phone-book.component';
import {SharedModule} from '../shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs';


@NgModule({
  declarations: [
    PhoneBookComponent
  ],
  imports: [
    CommonModule,
    PhoneBookRoutingModule,
    SharedModule,
    MatTabsModule
  ]
})
export class PhoneBookModule { }

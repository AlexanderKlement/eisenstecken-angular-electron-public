import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PhoneBookRoutingModule } from "./phone-book-routing.module";
import { PhoneBookComponent } from "./phone-book.component";
import {SharedModule} from "../shared/shared.module";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import { ContactEditDialogComponent } from "./contact-edit-dialog/contact-edit-dialog.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {FlexModule} from "ng-flex-layout";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from "@angular/material/legacy-autocomplete";


@NgModule({
  declarations: [
    PhoneBookComponent,
    ContactEditDialogComponent
  ],
    imports: [
        CommonModule,
        PhoneBookRoutingModule,
        SharedModule,
        MatTabsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FlexModule,
        MatDialogModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatAutocompleteModule
    ]
})
export class PhoneBookModule { }

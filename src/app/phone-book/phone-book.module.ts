import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PhoneBookRoutingModule } from "./phone-book-routing.module";
import { PhoneBookComponent } from "./phone-book.component";
import {SharedModule} from "../shared/shared.module";
import {MatTabsModule} from "@angular/material/tabs";
import { ContactEditDialogComponent } from "./contact-edit-dialog/contact-edit-dialog.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FlexModule} from "ng-flex-layout";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatAutocompleteModule} from "@angular/material/autocomplete";


@NgModule({
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
        MatAutocompleteModule,
        PhoneBookComponent,
        ContactEditDialogComponent
    ]
})
export class PhoneBookModule { }

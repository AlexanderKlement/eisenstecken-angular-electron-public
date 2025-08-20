import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexLayoutModule} from "ng-flex-layout";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {SharedModule} from "../shared/shared.module";
import { ProductsListComponent } from "./available-products-list/products-list.component";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyTooltipModule as MatTooltipModule} from "@angular/material/legacy-tooltip";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import { ProductEditDialogComponent } from "./available-products-list/product-edit-dialog/product-edit-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import {MatIconModule} from "@angular/material/icon";
import { OrderBundleDetailComponent } from "./order-bundle-detail/order-bundle-detail.component";
import { OrderBundleEditComponent } from "./order-bundle-edit/order-bundle-edit.component";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import { OrderedArticleMoveDialogComponent } from "./order-detail/ordered-article-move-dialog/ordered-article-move-dialog.component";
import {MatStepperModule} from "@angular/material/stepper";
import { ConvertRequestDialogComponent } from "./order-detail/convert-request-dialog/convert-request-dialog.component";


@NgModule({
  declarations: [
    OrderComponent,
    ProductsListComponent,
    ProductEditDialogComponent,
    OrderDetailComponent,
    OrderBundleDetailComponent,
    OrderBundleEditComponent,
    OrderedArticleMoveDialogComponent,
    ConvertRequestDialogComponent
  ],
    imports: [
        CommonModule,
        MatGridListModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        SharedModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatListModule,
        MatTooltipModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule,
        MatStepperModule
    ]
})
export class OrderModule { }

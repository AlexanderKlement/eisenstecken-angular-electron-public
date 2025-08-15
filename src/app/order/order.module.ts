import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {SharedModule} from "../shared/shared.module";
import { ProductsListComponent } from "./available-products-list/products-list.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import { ProductEditDialogComponent } from "./available-products-list/product-edit-dialog/product-edit-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSelectModule} from "@angular/material/select";
import { OrderDetailComponent } from "./order-detail/order-detail.component";
import {MatIconModule} from "@angular/material/icon";
import { OrderBundleDetailComponent } from "./order-bundle-detail/order-bundle-detail.component";
import { OrderBundleEditComponent } from "./order-bundle-edit/order-bundle-edit.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
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

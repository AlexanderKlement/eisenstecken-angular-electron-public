import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {SupplierRoutingModule} from "./supplier-routing.module";
import {SupplierDetailComponent} from "./supplier-detail/supplier-detail.component";
import {SupplierEditComponent} from "./supplier-edit/supplier-edit.component";
import {SharedModule} from "../shared/shared.module";
import {JobModule} from "../job/job.module";
import {ReactiveFormsModule} from "@angular/forms";
import {MatLegacyCheckboxModule as MatCheckboxModule} from "@angular/material/legacy-checkbox";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {OrderDialogComponent} from "./supplier-detail/order-dialog/order-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {SupplierComponent} from "./supplier.component";
import { StockDetailComponent } from "./stock-detail/stock-detail.component";
import { StockEditComponent } from "./stock-edit/stock-edit.component";
import { ArticleSupplierComponent } from "./article-supplier/article-supplier.component";
import { ArticleEditDialogComponent } from "./article-supplier/article-edit-dialog/article-edit-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import { FlexModule } from "ng-flex-layout";


@NgModule({
    declarations: [
        SupplierComponent,
        SupplierDetailComponent,
        SupplierEditComponent,
        OrderDialogComponent,
        StockDetailComponent,
        StockEditComponent,
        ArticleSupplierComponent,
        ArticleEditDialogComponent
    ],
    imports: [
        CommonModule,
        SupplierRoutingModule,
        SharedModule,
        JobModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatInputModule,
        FlexModule,
        MatTabsModule,
        MatDialogModule,
        MatListModule,
        MatProgressSpinnerModule,
        MatDatepickerModule,
        MatIconModule
    ]
})
export class SupplierModule {
}

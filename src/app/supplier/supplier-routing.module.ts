import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierComponent } from './supplier.component';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { StockEditComponent } from './stock-edit/stock-edit.component';
import { ArticleSupplierComponent } from './article-supplier/article-supplier.component';

const routes: Routes = [
  {
    path: 'supplier',
    component: SupplierComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true,
    },
  },
  {
    path: 'supplier/:id',
    component: SupplierDetailComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true,
    },
  },
  {
    path: 'supplier/edit/:id',
    component: SupplierEditComponent,
    data: { requiresLogin: true },
  },
  {
    path: 'stock/:id',
    component: StockDetailComponent,
    data: {
      requiresLogin: true,
      shouldDetach: true,
    },
  },
  {
    path: 'stock/edit/:id',
    component: StockEditComponent,
    data: { requiresLogin: true },
  },
  {
    path: 'supplier/articles/:supplier_id',
    component: ArticleSupplierComponent,
    data: {
      requiresLogin: true,
      type: 'supplier',
    },
  },
  {
    path: 'stock/articles/:supplier_id',
    component: ArticleSupplierComponent,
    data: {
      requiresLogin: true,
      type: 'stock',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierRoutingModule {}

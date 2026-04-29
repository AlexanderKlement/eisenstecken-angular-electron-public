import { Routes } from "@angular/router";

const supplierRoutes: Routes = [
  {
    path: "supplier",
    loadComponent: () => import("./supplier.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "supplier/:id",
    loadComponent: () => import("./supplier-detail/supplier-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "supplier/edit/:id",
    loadComponent: () => import("./supplier-edit/supplier-edit.component"),
    data: { requiresLogin: true }
  },
  {
    path: "stock/:id",
    loadComponent: () => import("./stock-detail/stock-detail.component"),
    data: {
      requiresLogin: true,
      shouldDetach: true
    }
  },
  {
    path: "stock/edit/:id",
    loadComponent: () => import("./stock-edit/stock-edit.component"),
    data: { requiresLogin: true }
  },
  {
    path: "supplier/articles/:supplier_id",
    loadComponent: () => import("./article-supplier/article-supplier.component"),
    data: {
      requiresLogin: true,
      type: "supplier"
    }
  },
  {
    path: "stock/articles/:supplier_id",
    loadComponent: () => import("./article-supplier/article-supplier.component"),
    data: {
      requiresLogin: true,
      type: "stock"
    }
  }
];

export default supplierRoutes;

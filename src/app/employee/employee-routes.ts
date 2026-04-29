import { Routes } from "@angular/router";

const employeeRoutes: Routes = [
  {
    path: "employee",
    loadComponent: () => import("./employee.component"),
    data: {
      requiresLogin: true
    }
  },
  {
    path: "employee/:id",
    loadComponent: () => import("./employee-detail/employee-detail.component"),
    data: {
      requiresLogin: true
    }
  },
  {
    path: "employee/redirect/:id",
    loadComponent: () => import("./employee-redirect/employee-redirect.component"),
    data: {
      requiresLogin: true
    }
  },
  {
    path: "work_day/new/:id",
    loadComponent: () => import("./work-day-new/work-day-new.component"),
    data: { requiresLogin: true }
  },
  {
    path: "meal/:id",
    loadComponent: () => import("./meal/meal.component"),
    data: {
      requiresLogin: true
    }
  },
  {
    path: "service/:id",
    loadComponent: () => import("./service/employee-service.component"),
    data: {
      requiresLogin: true
    }
  }
];

export default employeeRoutes;

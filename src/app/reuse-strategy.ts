import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from "@angular/router";

interface RouteStorageObject {
  snapshot: ActivatedRouteSnapshot;
  handle: DetachedRouteHandle;
}

export class CustomReuseStrategy implements RouteReuseStrategy {
  private storedRoutes = new Map<string, RouteStorageObject>();

  // ---- helpers ----
  private routeKey(route: ActivatedRouteSnapshot): string {
    const path = route.routeConfig?.path ?? "";
    const params = JSON.stringify(route.params || {});
    const query = JSON.stringify(route.queryParams || {});
    return `${path}?p=${params}&q=${query}`;
  }

  private getInstance(handle: DetachedRouteHandle | null): any {
    return (handle as any)?.componentRef?.instance;
  }

  private hasConcreteComponent(route: ActivatedRouteSnapshot): boolean {
    // Only detach routes that actually render a component in the outlet
    return !!route.routeConfig && !!route.routeConfig.component;
  }

  // ---- required API ----
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Must opt-in AND be a leaf component route
    return !!route.data?.shouldDetach && this.hasConcreteComponent(route);
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // remove stray tooltips (your original cleanup)
    while (document.getElementsByTagName("mat-tooltip-component").length > 0) {
      document.getElementsByTagName("mat-tooltip-component")[0].remove();
    }

    const inst = this.getInstance(handle);
    if (inst && typeof inst.onDetach === "function") {
      inst.onDetach();
    }

    this.storedRoutes.set(this.routeKey(route), { snapshot: route, handle });
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return this.storedRoutes.has(this.routeKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const key = this.routeKey(route);
    const entry = this.storedRoutes.get(key);
    if (!entry) return null;

    const inst = this.getInstance(entry.handle);
    if (inst && typeof inst.onAttach === "function") {
      inst.onAttach();
    }
    return entry.handle;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }
}

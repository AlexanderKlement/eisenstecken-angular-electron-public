import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

export interface DirtyAware {
  isDirty(): boolean;
  confirmDiscard(): Promise<boolean> | boolean;
}

@Injectable({ providedIn: 'root' })
export class DirtyFormGuard implements CanDeactivate<DirtyAware> {
  async canDeactivate(component: DirtyAware) {
    if (!component.isDirty()) return true;
    const ok = await component.confirmDiscard();
    return !!ok;
  }
}

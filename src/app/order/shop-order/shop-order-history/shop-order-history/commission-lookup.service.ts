import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";

// Adjust to your generated service, method and model.
import { DefaultService } from "../../../../../api/openapi";

export type CommissionLookup =
  | { status: "loading" }
  | { status: "loaded"; name: string }
  | { status: "error" };


@Injectable({ providedIn: "root" })
export class CommissionLookupService {
  private readonly api = inject(DefaultService);
  private readonly cache = new Map<number, WritableSignal<CommissionLookup>>();
  private readonly queue = new Set<number>();
  private flushScheduled = false;

  get(id: number): Signal<CommissionLookup> {
    console.log(`get ${id}`);
    let entry = this.cache.get(id);
    if (!entry) {
      entry = signal<CommissionLookup>({ status: "loading" });
      this.cache.set(id, entry);
      this.enqueue(id);
    }
    return entry.asReadonly();
  }

  /** Forget cached orders (all, or one), e.g. after an order was renamed. */
  invalidate(id?: number): void {
    if (id === undefined) {
      this.cache.clear();
      return;
    }
    this.cache.delete(id);
  }

  private enqueue(id: number): void {
    this.queue.add(id);
    if (this.flushScheduled) return;
    this.flushScheduled = true;
    // Deferred so the HTTP call never starts inside a template/computed evaluation,
    // and so all ids rendered in one change-detection pass are batched.
    queueMicrotask(() => this.flush());
  }

  private flush(): void {
    const ids = [...this.queue];
    this.queue.clear();
    this.flushScheduled = false;

    // If your API has a bulk endpoint (e.g. GET /orders?ids=1,2,3), call it once here
    // with `ids` instead of looping.
    for (const id of ids) {
      this.api.readOrderOrderOrderIdGet(id).subscribe({
        next: (order) => this.cache.get(id)?.set({ status: "loaded", name: order.order_to.displayable_name }),
        error: () => this.cache.get(id)?.set({ status: "error" })
      });
    }
  }
}

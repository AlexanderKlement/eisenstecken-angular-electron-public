import { inject, Injectable, Signal, signal, WritableSignal } from "@angular/core";

// Adjust to your generated service, method and model.
import { DefaultService } from "../../../../../api/openapi";
import dayjs from "dayjs/esm";

export type OrderLookup =
  | { status: "loading" }
  | { status: "loaded"; name: string }
  | { status: "error" };


@Injectable({ providedIn: "root" })
export class OrderBundleLookupService {
  private readonly api = inject(DefaultService);
  private readonly cache = new Map<number, WritableSignal<OrderLookup>>();
  private readonly queue = new Set<number>();
  private flushScheduled = false;

  get(id: number): Signal<OrderLookup> {
    let entry = this.cache.get(id);
    if (!entry) {
      entry = signal<OrderLookup>({ status: "loading" });
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
      this.api.readOrderBundleOrderBundleOrderBundleIdGet(id).subscribe({
        next: (order) => this.cache.get(id)?.set({
          status: "loaded",
          name: `${order.order_from.displayable_name} - ${order.user.fullname} - ${dayjs(order.create_date).format("DD.MM.YYYY, HH:mm")}`
        }),
        error: () => this.cache.get(id)?.set({ status: "error" })
      });
    }
  }
}

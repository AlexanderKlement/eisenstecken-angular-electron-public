import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommissionLookupService } from "./commission-lookup.service";

/**
 * Shows "#1042" right away and swaps in the order's displayable name as soon as it
 * has been loaded. Falls back to "#1042" if the order can't be loaded.
 */
@Component({
  selector: "app-commission-ref",
  standalone: true,
  imports: [MatTooltipModule],
  template: `<span
    class="order-ref"
    [class.order-ref--loading]="state().status === 'loading'"
    [matTooltip]="'Bestellung #' + orderId()"
    [matTooltipDisabled]="state().status !== 'loaded'"
  >{{ label() }}</span
  >`,
  styles: `
    :host {
      display: inline;
    }

    .order-ref {
      font-variant-numeric: tabular-nums;
      overflow-wrap: anywhere;
      transition: opacity 150ms;
    }

    .order-ref--loading {
      opacity: 0.6;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommissionRefComponent {
  private readonly commissions = inject(CommissionLookupService);

  readonly orderId = input.required<number>();

  readonly state = computed(() => this.commissions.get(this.orderId())());

  readonly label = computed(() => {
    const s = this.state();
    return s.status === "loaded" && s.name ? s.name : `#${this.orderId()}`;
  });
}

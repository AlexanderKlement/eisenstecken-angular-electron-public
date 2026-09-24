import { Component, computed, inject, input, LOCALE_ID, signal } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {
  OrderBundleArticleAddedEvent,
  OrderBundleArticleChangedEvent,
  OrderBundleArticleRemovedEvent,
  OrderBundleCreatedEvent,
  OrderBundleDeliveryDateChangedEvent,
  OrderBundleDescriptionChangedEvent,
  OrderBundleEvent,
  OrderBundleEventType,
  OrderBundleOrderAddedEvent,
  OrderBundleOrderRemovedEvent,
  OrderBundleOrderTargetChangedEvent,
  OrderBundleService,
  OrderedArticleChange,
  OrderedArticleSnapshot,
  UserEssential
} from "../../../../../api/openapi";
import { DatePipe, formatDate, formatNumber, NgTemplateOutlet } from "@angular/common";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatChipListbox, MatChipOption } from "@angular/material/chips";
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { catchError, map, scan, startWith, switchMap } from "rxjs/operators";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { combineLatest, of } from "rxjs";
import { MatProgressBar } from "@angular/material/progress-bar";
import { CommissionRefComponent } from "./commission-ref-component";

type ChangelogCategory = "bundle" | "order";
type ChangelogTone = "create" | "add" | "remove" | "change";
type ChangelogFilter = "all" | ChangelogCategory;


type ChangelogPart = { text: string; orderId?: never } | { orderId: number; text?: never };
export type ChangelogText = ChangelogPart[];


interface ChangelogField {
  label: string;
  value: ChangelogText;
}

interface ChangelogDiff {
  label: string;
  old: ChangelogText | null;
  new: ChangelogText | null;
}

interface ChangelogEntry {
  id: number;
  date: Date;
  category: ChangelogCategory;
  tone: ChangelogTone;
  icon: string;
  title: string;
  /** Short one-line context, e.g. "Order #1042 · moved from bundle #87" */
  subtitle?: ChangelogText;
  user: UserEssential | null;
  initials: string;
  fields: ChangelogField[];
  diffs: ChangelogDiff[];
}

interface ChangelogDay {
  key: string;
  date: Date;
  entries: ChangelogEntry[];
}

type EventType = (typeof OrderBundleEventType)[keyof typeof OrderBundleEventType];

const META: Record<EventType, { category: ChangelogCategory; tone: ChangelogTone; icon: string; title: string }> = {
  created: { category: "bundle", tone: "create", icon: "inventory_2", title: "bestellung erstellt" },
  description_changed: { category: "bundle", tone: "change", icon: "edit_note", title: "Beschreibung geändert" },
  delivery_date_changed: { category: "bundle", tone: "change", icon: "event", title: "Lieferdatum geändert" },
  order_added: { category: "order", tone: "add", icon: "playlist_add", title: "Bestellung hinzugefügt" },
  order_removed: { category: "order", tone: "remove", icon: "playlist_remove", title: "bestellung entfernt" },
  order_target_changed: { category: "order", tone: "change", icon: "swap_horiz", title: "Komission geändert" },
  article_added: { category: "order", tone: "add", icon: "add_shopping_cart", title: "Artikel entfernt" },
  article_changed: { category: "order", tone: "change", icon: "edit", title: "Artikel bearbeitet" },
  article_removed: { category: "order", tone: "remove", icon: "remove_shopping_cart", title: "Artikel entfernt" }
};

/** Labels for OrderedArticleChange keys, in display order. */
const ARTICLE_FIELDS: { key: keyof OrderedArticleChange; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "modNumber", label: "Mod. number" },
  { key: "amount", label: "Menge" },
  { key: "price", label: "Preis" },
  { key: "position", label: "Position" },
  { key: "comment", label: "Kommentar" },
  { key: "request", label: "Anfrage" },
  { key: "orderId", label: "Komission" },
  { key: "articleId", label: "Artikel" },
  { key: "orderedUnitId", label: "Einheit" }
];

interface LoadState {
  id: number | null;
  status: "loading" | "loaded" | "error";
  events: OrderBundleEvent[];
  error?: unknown;
}

export interface ShopOrderHistoryData {
  orderBundleId: number;
}

@Component({
  selector: "app-shop-order-history",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    FlexModule,
    MatButton,
    MatDialogActions,
    MatChipListbox,
    MatChipOption,
    MatIcon,
    DatePipe,
    MatTooltip,
    MatProgressBar,
    MatIconButton,
    CommissionRefComponent,
    NgTemplateOutlet
  ],
  templateUrl: "./shop-order-history.component.html",
  styleUrl: "./shop-order-history.component.scss"
})
export class ShopOrderHistoryComponent {
  private readonly locale = inject(LOCALE_ID);
  dialogRef = inject<MatDialogRef<ShopOrderHistoryComponent>>(MatDialogRef);
  private orderBundleService = inject(OrderBundleService);
  data = inject<ShopOrderHistoryData>(MAT_DIALOG_DATA);

  /** Currency symbol appended to prices. */
  readonly currency = input("€");

  readonly filter = signal<ChangelogFilter>("all");

  private readonly reloadTick = signal(0);

  private readonly state = toSignal(
    combineLatest([toObservable(this.reloadTick)]).pipe(
      switchMap(([id]) =>
        this.orderBundleService.getOrderBundleHistory(this.data.orderBundleId).pipe(
          map((events): Partial<LoadState> => ({ id, status: "loaded", events })),
          catchError((error: unknown) => of<Partial<LoadState>>({ id, status: "error", error })),
          startWith<Partial<LoadState>>({ id, status: "loading" })
        )
      ),
      // Keep the current list visible while reloading the same bundle;
      // clear it when switching to another bundle.
      scan(
        (prev: LoadState, next: Partial<LoadState>): LoadState => ({
          id: next.id ?? prev.id,
          status: next.status ?? prev.status,
          events: next.events ?? (next.id === prev.id ? prev.events : []),
          error: next.status === "error" ? next.error : undefined
        }),
        { id: null, status: "loading", events: [] } as LoadState
      )
    ),
    { initialValue: { id: null, status: "loading", events: [] } as LoadState }
  );

  readonly events = computed(() => this.state().events);
  readonly loading = computed(() => this.state().status === "loading");
  readonly error = computed(() => (this.state().status === "error" ? this.state().error ?? true : null));
  /** True only on the very first load, before any events are known. */
  readonly initialLoading = computed(() => this.loading() && this.events().length === 0);

  /** Reload the events, e.g. after the bundle was edited. Callable from the parent via viewChild. */
  reload(): void {
    this.reloadTick.update((n) => n + 1);
  }

  readonly entries = computed(() =>
    [...this.events()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id - a.id)
      .map((e) => this.toEntry(e))
  );

  readonly counts = computed(() => {
    const c: Record<ChangelogFilter, number> = { all: 0, bundle: 0, order: 0 };
    for (const e of this.entries()) {
      c.all++;
      c[e.category]++;
    }
    return c;
  });

  readonly days = computed<ChangelogDay[]>(() => {
    const f = this.filter();
    const groups = new Map<string, ChangelogDay>();
    for (const e of this.entries()) {
      if (f !== "all" && e.category !== f) continue;
      const key = formatDate(e.date, "yyyy-MM-dd", this.locale);
      let day = groups.get(key);
      if (!day) {
        day = { key, date: e.date, entries: [] };
        groups.set(key, day);
      }
      day.entries.push(e);
    }
    return [...groups.values()];
  });

  readonly filters: { value: ChangelogFilter; label: string; icon: string }[] = [
    { value: "all", label: "Alle", icon: "history" },
    { value: "bundle", label: "Bestellung", icon: "inventory_2" },
    { value: "order", label: "Artikel", icon: "receipt_long" }
  ];

  setFilter(value: ChangelogFilter | null | undefined): void {
    this.filter.set(value ?? "all");
  }

  // ---------------------------------------------------------------- mapping

  private toEntry(event: OrderBundleEvent): ChangelogEntry {
    const type = event.eventType as unknown as EventType;
    const meta = META[type] ?? { category: "bundle", tone: "change", icon: "info", title: type };
    const entry: ChangelogEntry = {
      id: event.id,
      date: new Date(event.createdAt),
      ...meta,
      user: event.user ?? null,
      initials: this.initials(event.user),
      fields: [],
      diffs: []
    };

    const p = event.payload;
    switch (type) {
      case "created": {
        const x = p as OrderBundleCreatedEvent;
        entry.subtitle = txt(x.description);
        entry.fields = [
          { label: "Delivery date", value: txt(this.date(x.deliveryDate)) },
          { label: "Source", value: txt(String(x.source)) },
          { label: "Supplier", value: txt(`#${x.orderFromId}`) },
          { label: "Orders", value: orders(x.orderIds) },
          ...(x.sourceOrderIds?.length ? [{ label: "Source orders", value: orders(x.sourceOrderIds) }] : []),
          { label: "Request", value: txt(this.bool(x.request)) }
        ];
        break;
      }
      case "description_changed": {
        const x = p as OrderBundleDescriptionChangedEvent;
        entry.diffs = [{ label: "Description", old: txtOrNull(x.old), new: txtOrNull(x.new) }];
        break;
      }
      case "delivery_date_changed": {
        const x = p as OrderBundleDeliveryDateChangedEvent;
        entry.diffs = [{ label: "Delivery date", old: txt(this.date(x.old)), new: txt(this.date(x.new)) }];
        break;
      }
      case "order_added": {
        const x = p as OrderBundleOrderAddedEvent;
        entry.subtitle = order(x.orderId);
        if (x.oldOrderBundleId != null) entry.subtitle.push({ text: ` · moved from bundle #${x.oldOrderBundleId}` });
        break;
      }
      case "order_removed": {
        const x = p as OrderBundleOrderRemovedEvent;
        entry.subtitle = order(x.orderId);
        if (x.newOrderBundleId != null) entry.subtitle.push({ text: ` · moved to bundle #${x.newOrderBundleId}` });
        break;
      }
      case "order_target_changed": {
        const x = p as OrderBundleOrderTargetChangedEvent;
        entry.subtitle = order(x.orderId);
        entry.diffs = [{ label: "Target", old: txtOrNull(this.ref(x.old)), new: txtOrNull(this.ref(x.new)) }];
        break;
      }
      case "article_added": {
        const x = p as OrderBundleArticleAddedEvent;
        entry.subtitle = txt(this.articleLine(x.orderedArticle));
        if (x.oldOrderId != null) entry.subtitle.push({ text: " · moved from " }, ...order(x.oldOrderId));
        entry.fields = this.articleFields(x.orderedArticle);
        break;
      }
      case "article_removed": {
        const x = p as OrderBundleArticleRemovedEvent;
        entry.subtitle = txt(this.articleLine(x.orderedArticle));
        if (x.newOrderId != null) entry.subtitle.push({ text: " · moved to " }, ...order(x.newOrderId));
        entry.fields = this.articleFields(x.orderedArticle);
        break;
      }
      case "article_changed": {
        const x = p as OrderBundleArticleChangedEvent;
        entry.subtitle = txt(x.name ?? x.new.name ?? x.old.name ?? `Article #${x.orderedArticleId}`);
        entry.diffs = ARTICLE_FIELDS.filter(({ key }) => (x.old[key] ?? null) !== (x.new[key] ?? null)).map(({
                                                                                                               key,
                                                                                                               label
                                                                                                             }) => ({
          label,
          old: this.articleValue(key, x.old[key]),
          new: this.articleValue(key, x.new[key])
        }));
        break;
      }
    }
    return entry;
  }

  // ------------------------------------------------------------- formatting

  private articleLine(a: OrderedArticleSnapshot): string {
    return `${this.num(a.amount)} × ${a.name ?? a.modNumber}`;
  }

  private articleFields(a: OrderedArticleSnapshot): ChangelogField[] {
    return [
      { label: "Mod. number", value: txt(a.modNumber) },
      { label: "Price", value: txt(this.price(a.price)) },
      { label: "Order", value: [{ orderId: a.orderId }] },
      ...(a.position ? [{ label: "Position", value: txt(a.position) }] : []),
      ...(a.comment ? [{ label: "Comment", value: txt(a.comment) }] : []),
      ...(a.request ? [{ label: "Request", value: txt("Yes") }] : [])
    ];
  }

  private articleValue(key: keyof OrderedArticleChange, v: unknown): ChangelogText | null {
    if (v === null || v === undefined || v === "") return null;
    switch (key) {
      case "orderId":
        return [{ orderId: v as number }];
      case "price":
        return txt(this.price(v as number));
      case "amount":
        return txt(this.num(v as number));
      case "request":
        return txt(this.bool(v as boolean));
      case "articleId":
      case "orderedUnitId":
        return txt(`#${v}`);
      default:
        return txt(String(v));
    }
  }

  private date(v: string | null | undefined): string {
    return v ? formatDate(v, "mediumDate", this.locale) : "—";
  }

  private num(v: number): string {
    return formatNumber(v, this.locale, "1.0-3");
  }

  private price(v: number): string {
    return `${formatNumber(v, this.locale, "1.2-2")} ${this.currency()}`;
  }

  private bool(v: boolean): string {
    return v ? "Yes" : "No";
  }

  private ref(v: number | null | undefined): string | null {
    return v == null ? null : `#${v}`;
  }

  private initials(u: UserEssential | null | undefined): string {
    if (!u) return "";
    const a = u.firstname?.[0] ?? "";
    const b = u.secondname?.[0] ?? "";
    return (a + b || u.fullname?.[0] || u.email[0]).toUpperCase();
  }

  /*####################### */

  protected onCancelClick() {
    this.dialogRef.close();
  }

  protected readonly JSON = JSON;
}

function txt(text: string): ChangelogText {
  return [{ text }];
}

function txtOrNull(text: string | null | undefined): ChangelogText | null {
  return text ? [{ text }] : null;
}

/** "Order <ref>" */
function order(id: number): ChangelogText {
  return [{ text: "Order " }, { orderId: id }];
}

/** "<ref>, <ref>, <ref>" or "—" */
function orders(ids: number[] | null | undefined): ChangelogText {
  if (!ids?.length) return txt("—");
  return ids.flatMap((orderId, i): ChangelogText => (i ? [{ text: ", " }, { orderId }] : [{ orderId }]));
}

import { Component, computed, inject, input, LOCALE_ID, signal } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {
  ArticleDeletedEvent,
  ArticleMovedEvent,
  ArticleOrderedEvent,
  ArticlesMovedEvent,
  ArticleUpdatedEvent,
  OrderBundleCreatedEvent,
  OrderBundleEvent,
  OrderBundleEventType,
  OrderBundleService,
  OrderDeletedEvent,
  OrderedArticleChange,
  OrderedArticleSnapshot,
  PricesUpdatedEvent,
  RequestsConvertedEvent,
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
import { OrderBundleRefComponent } from "./order-bundle-ref-component";


// ------------------------------------------------------------------ view model

export type ChangelogCategory = "order" | "article";
export type ChangelogTone = "create" | "add" | "remove" | "change" | "move";
export type ChangelogFilter = "all" | ChangelogCategory;

/**
 * A piece of displayed text. Either plain text, or an order reference that
 * <app-order-ref> renders as "#id" and later as the order's displayable name.
 */
export type ChangelogPart = { text: string; orderId?: never } | { orderId: number; text?: never };
export type ChangelogText = ChangelogPart[];

export interface ChangelogField {
  label: string;
  value: ChangelogText;
}

export interface ChangelogDiff {
  label: string;
  old: ChangelogText | null;
  new: ChangelogText | null;
}

/** One row in an entry's article list. */
export interface ChangelogArticle {
  id: number;
  /** "28 × Home jersey" */
  title: string;
  /** "JSY-HOME-26 · 34,90 € · <order ref>" */
  meta: ChangelogText;
  request: boolean;
}

export interface ChangelogEntry {
  id: number;
  date: Date;
  category: ChangelogCategory;
  tone: ChangelogTone;
  icon: string;
  title: string;
  /** Short one-line context, e.g. "28 × Home jersey · Order <ref>" */
  subtitle?: ChangelogText;
  /** Side effects worth calling out, e.g. "New order created" */
  badges: string[];
  user: UserEssential | null;
  initials: string;
  diffs: ChangelogDiff[];
  fields: ChangelogField[];
  articles: ChangelogArticle[];
}

export interface ChangelogDay {
  key: string;
  date: Date;
  entries: ChangelogEntry[];
}

interface LoadState {
  id: number | null;
  status: "loading" | "loaded" | "error";
  events: OrderBundleEvent[];
  error?: unknown;
}

type Meta = { category: ChangelogCategory; tone: ChangelogTone; icon: string; title: string };

const META: Record<OrderBundleEventType, Meta> = {
  order_bundle_created: { category: "order", tone: "create", icon: "inventory_2", title: "Bestellung erstellt" },
  order_deleted: { category: "order", tone: "remove", icon: "delete", title: "Bestellung gelöscht" },
  requests_converted: {
    category: "order",
    tone: "create",
    icon: "published_with_changes",
    title: "Anfrage bestellt"
  },
  article_ordered: { category: "article", tone: "add", icon: "add_shopping_cart", title: "Artikel bestellt" },
  article_updated: { category: "article", tone: "change", icon: "edit", title: "Artikel geändert" },
  article_deleted: { category: "article", tone: "remove", icon: "remove_shopping_cart", title: "Artikel gelöscht" },
  article_moved: { category: "article", tone: "move", icon: "move_up", title: "Komission geändert" },
  articles_moved: { category: "article", tone: "move", icon: "move_up", title: "Komission geändert" },
  prices_updated: { category: "article", tone: "change", icon: "euro", title: "Preis verändert" }
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
  { key: "articleId", label: "Artikel" },
  { key: "orderedUnitId", label: "Einheit" }
];

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
    OrderBundleRefComponent,
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

  protected onCancelClick() {
    this.dialogRef.close();
  }

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
    const c: Record<ChangelogFilter, number> = { all: 0, order: 0, article: 0 };
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
    { value: "all", label: "All", icon: "history" },
    { value: "order", label: "Bestellung", icon: "receipt_long" },
    { value: "article", label: "Artikel", icon: "category" }
  ];

  setFilter(value: ChangelogFilter | null | undefined): void {
    this.filter.set(value ?? "all");
  }


  // ------------------------------------------------------------------ mapping

  private toEntry(event: OrderBundleEvent): ChangelogEntry {
    const type = event.eventType;
    const meta: Meta = META[type] ?? { category: "order", tone: "change", icon: "info", title: String(type) };
    const entry: ChangelogEntry = {
      id: event.id,
      date: new Date(event.createdAt),
      ...meta,
      user: event.user ?? null,
      initials: this.initials(event.user),
      badges: [],
      diffs: [],
      fields: [],
      articles: []
    };

    const p = event.payload;
    switch (type) {
      case "order_bundle_created": {
        const x = p as OrderBundleCreatedEvent;
        entry.subtitle = txt(x.description);
        entry.fields = [
          { label: "Lieferdatum", value: txt(this.date(x.deliveryDate)) },
          { label: "Von", value: txt(x.orderFromName) },
          { label: "Typ", value: txt(x.source === "manually" ? "Manuell" : "Online Shop") },
          { label: "Anfrage", value: txt(this.bool(x.request)) }
        ];
        entry.articles = this.articles(x.orderedArticles);
        break;
      }

      case "order_deleted": {
        const x = p as OrderDeletedEvent;
        entry.subtitle = order(x.orderId);
        entry.fields = [
          { label: "From", value: txt(x.orderFromName) },
          ...(x.orderToName ? [{ label: "Komission", value: txt(x.orderToName) }] : []),
          ...(x.description ? [{ label: "beschreibung", value: txt(x.description) }] : [])
        ];
        entry.articles = this.articles(x.orderedArticles, false);
        break;
      }

      case "requests_converted": {
        const x = p as RequestsConvertedEvent;
        entry.subtitle = [{ text: "Into " }, ...order(x.targetOrderId)];
        entry.fields = [
          { label: "Von", value: txt(x.orderFromName) },
          ...(x.orderToName ? [{ label: "To", value: txt(x.orderToName) }] : []),
          { label: "Bestellungen", value: orders(x.sourceOrderIds) }
        ];
        entry.articles = this.articles(x.orderedArticles, false);
        break;
      }

      case "article_ordered": {
        const x = p as ArticleOrderedEvent;
        entry.subtitle = [{ text: `${this.articleLine(x.orderedArticle)} · ` }, ...order(x.orderedArticle.orderId)];
        if (x.articleCreated) entry.badges.push("Neuer Artikel");
        entry.fields = this.articleFields(x.orderedArticle);
        break;
      }

      case "article_deleted": {
        const x = p as ArticleDeletedEvent;
        entry.subtitle = [{ text: `${this.articleLine(x.orderedArticle)} · ` }, ...order(x.orderedArticle.orderId)];
        if (x.orderDeleted) entry.badges.push("Bestellung gelöscht");
        entry.fields = this.articleFields(x.orderedArticle);
        break;
      }

      case "article_updated": {
        const x = p as ArticleUpdatedEvent;
        const name = x.name ?? x.new.name ?? x.old.name ?? `Artikel #${x.orderedArticleId}`;
        entry.subtitle = [{ text: `${name} · ` }, ...order(x.orderId)];
        entry.diffs = ARTICLE_FIELDS.filter(({ key }) => (x.old[key] ?? null) !== (x.new[key] ?? null)).map(
          ({ key, label }) => ({
            label,
            old: this.articleValue(key, x.old[key]),
            new: this.articleValue(key, x.new[key])
          })
        );
        break;
      }

      case "article_moved": {
        const x = p as ArticleMovedEvent;
        entry.subtitle = txt(this.articleLine(x.orderedArticle));
        entry.diffs = [
          {
            label: "Komission",
            old: txt(x.sourceOrderableName),
            new: txt(x.targetOrderableName)
          }
        ];
        if (x.targetOrderCreated) entry.badges.push("Neue Bestellung");
        if (x.sourceOrderDeleted) entry.badges.push("Bestellung gelöscht");
        entry.fields = this.articleFields(x.orderedArticle);
        break;
      }

      case "articles_moved": {
        const x = p as ArticlesMovedEvent;
        const n = x.orderedArticles.length;
        entry.subtitle = txt(`${n} Artikel`);
        entry.diffs = [
          {
            label: "Komission",
            old: txt(x.sourceOrderableName),
            new: txt(x.targetOrderableName)
          }
        ];
        if (x.sourceOrderBundleId !== x.targetOrderBundleId) {
          entry.diffs.push({
            label: "Bestellung",
            old: orderAt(x.sourceOrderBundleId, undefined),
            new: orderAt(x.targetOrderBundleId, undefined)
          });
        }
        if (x.createdOrderBundleId != null) entry.badges.push(`Neue Bestellung #${x.createdOrderBundleId} erstellt`);
        entry.articles = this.articles(x.orderedArticles, false);
        break;
      }

      case "prices_updated": {
        const x = p as PricesUpdatedEvent;
        const n = x.prices.length;
        entry.subtitle = txt(`${n} ${n === 1 ? "Preis" : "Preise"} geändert`);
        entry.diffs = x.prices.map((c) => ({
          label: c.name ?? `Artikel #${c.orderedArticleId}`,
          old: txt(this.price(c.oldPrice)),
          new: txt(this.price(c.newPrice))
        }));
        break;
      }
    }
    return entry;
  }

  // --------------------------------------------------------------- formatting

  private articleLine(a: OrderedArticleSnapshot): string {
    return `${this.num(a.amount)} × ${a.name ?? a.modNumber}`;
  }

  /** Detail grid for a single article (the order is already in the subtitle or diff). */
  private articleFields(a: OrderedArticleSnapshot): ChangelogField[] {
    return [
      { label: "Mod. number", value: txt(a.modNumber) },
      { label: "Preis", value: txt(this.price(a.price * a.amount)) },
      ...(a.comment ? [{ label: "Kommentar", value: txt(a.comment) }] : []),
      ...(a.request ? [{ label: "Anfrage", value: txt("Yes") }] : [])
    ];
  }

  /** Compact rows for events that touch several articles. */
  private articles(list: OrderedArticleSnapshot[] | null | undefined, withOrder = true): ChangelogArticle[] {
    return (list ?? []).map((a) => {
      const meta: ChangelogText = [{ text: `${a.modNumber} · ${this.price(a.price)}` }];
      if (a.position) meta.push({ text: ` · Pos. ${a.position}` });
      if (withOrder) meta.push({ text: " · " }, { orderId: a.orderId });
      return { id: a.orderedArticleId, title: this.articleLine(a), meta, request: a.request };
    });
  }

  private articleValue(key: keyof OrderedArticleChange, v: unknown): ChangelogText | null {
    if (v === null || v === undefined || v === "") return null;
    switch (key) {
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
    return v ? "Ja" : "Nein";
  }

  private initials(u: UserEssential | null | undefined): string {
    if (!u) return "";
    const a = u.firstname?.[0] ?? "";
    const b = u.secondname?.[0] ?? "";
    return (a + b || u.fullname?.[0] || u.email[0]).toUpperCase();
  }
}

// ---------------------------------------------------------------- text helpers

function txt(text: string): ChangelogText {
  return [{ text }];
}

/** "Order <ref>" */
function order(id: number): ChangelogText {
  return [{ text: "Bestellung " }, { orderId: id }];
}

/** "<ref> · Orderable name" */
function orderAt(id: number, orderableName: string | null | undefined): ChangelogText {
  return orderableName ? [{ orderId: id }, { text: ` · ${orderableName}` }] : [{ orderId: id }];
}

/** "<ref>, <ref>, <ref>" or "—" */
function orders(ids: number[] | null | undefined): ChangelogText {
  if (!ids?.length) return txt("—");
  return ids.flatMap((orderId, i): ChangelogText => (i ? [{ text: ", " }, { orderId }] : [{ orderId }]));
}

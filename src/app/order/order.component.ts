import { Component, OnInit } from "@angular/core";
import { Observable, Subscriber, combineLatest } from "rxjs";
import {
  isJob,
  ListItem,
  SupportedListElements,
} from "../shared/components/filterable-clickable-list/filterable-clickable-list.types";
import { first } from "rxjs/operators";
import {
  CustomButton,
  ToolbarComponent,
} from "../shared/components/toolbar/toolbar.component";
import { Router } from "@angular/router";
import {
  OrderableType,
  OrderedArticle,
  Article,
  DefaultService, OrderedArticleSmall,
} from "../../api/openapi";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  FlexModule,
  DefaultFlexDirective,
} from "ng-flex-layout";
import { FilterableClickableListComponent } from "../shared/components/filterable-clickable-list/filterable-clickable-list.component";
import { ProductsListComponent } from "./available-products-list/products-list.component";

@Component({
  selector: "app-order",
  templateUrl: "./order.component.html",
  styleUrls: ["./order.component.scss"],
  imports: [
    ToolbarComponent,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    FlexModule,
    DefaultFlexDirective,
    FilterableClickableListComponent,
    ProductsListComponent,
  ],
})
export class OrderComponent implements OnInit {
  toListName = "Bestelle für Aufträge oder Lager";
  toList$: Observable<ListItem[]>; //Here go stocks and suppliers
  toListSubscriber: Subscriber<ListItem[]>;
  toListSelected: ListItem;

  toListUncollapse = "";

  fromListName = "Bestelle von Lieferanten oder Lager";
  fromList$: Observable<ListItem[]>;
  fromListSubscriber: Subscriber<ListItem[]>;
  fromListSelected: ListItem;

  availableProductListName = "Verfügbare Artikel";
  availableProducts$: Observable<Article[]>;
  availableProductsSubscriber: Subscriber<Article[]>;
  private availableArticleFilter = "";

  orderedProductListName = "Ausgewählte Artikel";
  orderedProducts$: Observable<OrderedArticle[]>;
  orderedProductsSubscriber: Subscriber<OrderedArticleSmall[]>;
  private orderedArticleFilter = "";

  step = 0;

  lastOrderId: number;
  buttons: CustomButton[] = [];

  constructor(
    private api: DefaultService,
    private router: Router,
  ) {}

  private static createListItems(
    supportedListElements: SupportedListElements[],
  ): ListItem[] {
    const listItems: ListItem[] = [];
    for (const elem of supportedListElements) {
      const listItem: ListItem = {
        name: isJob(elem)
          ? `${elem.code} | ${elem.displayable_name}`
          : elem.displayable_name,
        item: elem,
        type: elem.type,
        collapse: false,
      };

      listItems.push(listItem);
      if (isJob(elem)) {
        elem.sub_jobs.forEach((subJob) => {
          listItems.push({
            name: `${subJob.code} | ${subJob.displayable_name}`,
            item: subJob,
            type: subJob.type,
            collapse: elem.displayable_name,
          });
        });
      }
    }
    return listItems;
  }

  ngOnInit(): void {
    this.toList$ = new Observable<ListItem[]>((toListSubscriber) => {
      this.toListSubscriber = toListSubscriber;
      this.loadToList();
    });
    this.fromList$ = new Observable<ListItem[]>((fromListSubscriber) => {
      this.fromListSubscriber = fromListSubscriber;
    });
    this.availableProducts$ = new Observable<Article[]>(
      (availableProductsSubscriber) => {
        this.availableProductsSubscriber = availableProductsSubscriber;
      },
    );
    this.orderedProducts$ = new Observable<OrderedArticle[]>(
      (orderedProductsSubscriber) => {
        this.orderedProductsSubscriber = orderedProductsSubscriber;
      },
    );
  }

  toggleChildren(listItem: ListItem): void {
    if (listItem.type === "job" && listItem.collapse === false) {
      this.toListUncollapse =
        this.toListUncollapse === listItem.name ? "" : listItem.name;
    } else if (listItem.collapse !== this.toListUncollapse) {
      this.toListUncollapse = "";
    }
  }

  toListItemClicked(listItem: ListItem): void {
    this.resetProductWindows();
    this.toggleChildren(listItem);
    this.decideWhichFromListToLoad(listItem);
    this.toListSelected = listItem;
    this.step = 1;
    this.clearButtons();
  }

  fromListItemClicked(listItem: ListItem): void {
    this.clearButtons();
    this.step = 2;
    this.resetProductWindows();
    this.fromListSelected = listItem;
    this.loadAvailableArticlesAndButtons();
    this.loadOrderedArticles();
  }

  refreshOrderedProducts(): void {
    this.loadOrderedArticles();
  }

  refreshAvailableProducts(): void {
    this.loadAvailableArticlesAndButtons();
  }

  loadOrderedArticles(): void {
    this.api
      .readOrderFromToOrderFromOrderableFromIdToOrderableToIdGet(
        this.fromListSelected.item.id,
        this.toListSelected.item.id,
      )
      .pipe(first())
      .subscribe((order) => {
        this.lastOrderId = order.id;
        this.orderedProductsSubscriber.next(order.articles);
      });
  }

  decideWhichFromListToLoad(listItem: ListItem): void {
    switch (listItem.type) {
      case OrderableType.Stock: {
        this.loadFromList(false);
        break;
      }
      case OrderableType.Job: {
        this.loadFromList(true);
        break;
      }
      case OrderableType.Supplier: {
        console.error(
          "OrderComponent: an item with type SUPPLIER has been clicked in TO list",
        );
        break;
      }
    }
  }

  resetProductWindows(): void {
    if (this.availableProductsSubscriber !== undefined) {
      this.availableProductsSubscriber.next([]);
    }
    if (this.orderedProductsSubscriber !== undefined) {
      this.orderedProductsSubscriber.next([]);
    }
  }

  clearButtons() {
    this.buttons = [];
  }

  private loadToList() {
    const stocks$ = this.api.readStocksStockGet().pipe(first());
    const jobs$ = this.api
      .readJobsJobGet(0, 1000, "", undefined, "JOBSTATUS_ACCEPTED", true)
      .pipe(first());

    combineLatest([stocks$, jobs$]).subscribe(([stocks, jobs]) => {
      const stockListItems = OrderComponent.createListItems(stocks);
      const jobListItems = OrderComponent.createListItems(jobs);
      stockListItems.push(...jobListItems);
      this.toListSubscriber.next(stockListItems);
    });
  }

  private loadFromList(withStocks: boolean) {
    const stocks$ = this.api.readStocksStockGet().pipe(first());
    const suppliers$ = this.api
      .readSuppliersSupplierGet(0, 500, "", true)
      .pipe(first());

    if (withStocks) {
      combineLatest([stocks$, suppliers$]).subscribe(([stocks, jobs]) => {
        const stockListItems = OrderComponent.createListItems(stocks);
        const jobListItems = OrderComponent.createListItems(jobs);
        stockListItems.push(...jobListItems);
        this.fromListSubscriber.next(stockListItems);
      });
    } else {
      suppliers$.subscribe((suppliers) => {
        this.fromListSubscriber.next(OrderComponent.createListItems(suppliers));
      });
    }
  }

  private loadAvailableArticlesAndButtons(): void {
    switch (this.fromListSelected.type) {
      case OrderableType.Stock: {
        this.api
          .readArticlesByStockArticleStockStockIdGet(
            this.fromListSelected.item.id,
            0,
            100,
            this.availableArticleFilter ?? "",
          )
          .pipe(first())
          .subscribe((articles) => {
            this.availableProductsSubscriber.next(articles);
          });
        this.buttons = [];
        this.buttons.push({
          name: "Öffne Lager",
          navigate: () => {
            this.router.navigateByUrl("stock/" + this.fromListSelected.item.id);
          },
        });
        break;
      }
      case OrderableType.Job: {
        console.error(
          "OrderComponent: an item with type JOB has been clicked in FROM list",
        );
        break;
      }
      case OrderableType.Supplier: {
        this.api
          .readArticlesBySupplierArticleSupplierSupplierIdGet(
            this.fromListSelected.item.id,
            0,
            100,
            this.availableArticleFilter ?? "",
          )
          .pipe(first())
          .subscribe((articles) => {
            this.availableProductsSubscriber.next(articles);
          });
        this.buttons = [];
        this.buttons.push({
          name: "Öffne Lieferant",
          navigate: () => {
            this.router.navigateByUrl(
              "supplier/" + this.fromListSelected.item.id,
            );
          },
        });
        break;
      }
    }
  }

  onAvailableSearchChange(filter: string): void {
    this.availableArticleFilter = (filter ?? "").trim().toLowerCase();
    this.refreshAvailableProducts();
  }

  onOrderedSearchChange(filter: string): void {
    this.orderedArticleFilter = (filter ?? "").trim().toLowerCase();
    this.refreshOrderedProducts();
  }
}

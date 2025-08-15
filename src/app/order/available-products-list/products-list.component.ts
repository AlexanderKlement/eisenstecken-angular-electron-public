import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Observable, of, Subscription } from "rxjs";
import { UntypedFormControl } from "@angular/forms";
import { debounceTime, first, startWith, switchMap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { OrderDialogData, ProductEditDialogComponent } from "./product-edit-dialog/product-edit-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {
  DefaultService,
  OrderedArticle,
  Article,
  ArticleUpdateFull,
  ArticleCreate,
  OrderedArticleCreate,
} from "../../../api/openapi";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit, OnDestroy {

  @Input() availableProducts$: Observable<Article[]>;
  @Input() orderedProducts$: Observable<OrderedArticle[]>;
  @Input() name: string;
  @Input() orderId: number;
  @Input() available: boolean;

  @Output() refreshOrderedArticleListEmitter = new EventEmitter();
  @Output() refreshAvailableArticleListEmitter = new EventEmitter();

  search: UntypedFormControl;
  searchAvailableArticles$: Observable<Article[]>;
  searchOrderedArticles$: Observable<OrderedArticle[]>;
  orderedArticles: OrderedArticle[];
  articles: Article[];
  subscription: Subscription;

  constructor(public dialog: MatDialog, private api: DefaultService, private snackBar: MatSnackBar) {
  }

  public static createEditDialogData(orderedArticle: OrderedArticle, title: string, api: DefaultService,
                                     blockRequestChange: boolean = false): Observable<OrderDialogData> {
    return new Observable<OrderDialogData>((dialogDataSubscriber) => {
      api.readVatByAmountVatVatAmountGet(orderedArticle.vat).pipe(first()).subscribe((vat) => {
        const dialogData = ProductsListComponent.createEmptyDialogData(title, orderedArticle.article);
        dialogData.amount = orderedArticle.amount;
        dialogData.discount = orderedArticle.discount;
        dialogData.custom_description = orderedArticle.custom_description;
        dialogData.price = orderedArticle.price;
        dialogData.unit_id = orderedArticle.ordered_unit.id;
        dialogData.vat_id = vat.id;
        dialogData.request = orderedArticle.request;
        dialogData.comment = orderedArticle.comment;
        dialogData.position = orderedArticle.position;
        dialogData.create = false;
        dialogData.blockRequestChange = blockRequestChange;
        dialogDataSubscriber.next(dialogData);
      });
    });
  }

  public static deleteOrderedArticle(orderedArticleId: number, api: DefaultService): Observable<boolean> {
    return api.deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(orderedArticleId);
  }

  public static mapDialogData2ArticleUpdate(dialogData: OrderDialogData): ArticleUpdateFull {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: dialogData.mod_number,
      price: dialogData.price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: dialogData.unit_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name_de: dialogData.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name_it: dialogData.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      description_de: dialogData.custom_description,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      description_it: dialogData.custom_description,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: dialogData.vat_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      category_ids: [],
    };
  }

  public static mapDialogData2OrderedArticleCreate(dialogData: OrderDialogData, articleId: number): OrderedArticleCreate {
    return {
      amount: dialogData.amount,
      discount: dialogData.discount,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: dialogData.vat_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      custom_description: dialogData.custom_description,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      article_id: articleId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      ordered_unit_id: dialogData.unit_id,
      price: dialogData.price,
      comment: dialogData.comment,
      position: dialogData.position,
      request: dialogData.request,
    };
  }

  private static mapDialogData2ArticleCreate(dialogData: OrderDialogData, supplierId: number): ArticleCreate {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: dialogData.mod_number,
      price: dialogData.price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: dialogData.unit_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name_de: dialogData.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name_it: dialogData.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      description_de: dialogData.custom_description,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      description_it: dialogData.custom_description,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: dialogData.vat_id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      category_ids: [],
      // eslint-disable-next-line @typescript-eslint/naming-convention
      supplier_id: supplierId,
    };
  }

  private static createEmptyDialogData(title: string, article?: Article): OrderDialogData {
    if (article === undefined) {
      return {
        title,
        amount: 0,
        discount: 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        custom_description: "",
        name: "",
        description: "",
        price: 0.0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        mod_number: "",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: 3,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: 3,
        request: false,
        comment: "",
        position: "",
        delete: false,
        create: true,
        blockRequestChange: false,
      };
    }
    return {
      title,
      amount: 0,
      discount: 0,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      custom_description: article.description.translation,
      name: article.name.translation,
      description: article.description.translation,
      price: article.price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: article.mod_number,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: article.vat.id,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: 3,
      request: false,
      comment: "",
      position: "",
      delete: false,
      create: true,
      blockRequestChange: false,
    };
  }

  orderedArticleFilterFunction = (element: Article, filterString: string): boolean => {
    const words = filterString.split(" ");
    for (const word of words) {
      if (element.name.translation.toLowerCase().indexOf(word) < 0) {
        return false;
      }
    }
    return true;
  };

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.search = new UntypedFormControl("");
    if (this.available) {
      this.articles = [];
      this.subscription.add(this.availableProducts$.subscribe((products) => {
        this.articles = products;
        this.search.setValue("");
      }));
      this.searchAvailableArticles$ = this.search.valueChanges.pipe(
        startWith(null),
        debounceTime(200),
        switchMap((filterString: string) => {
          if (!filterString) {
            return of(this.articles);
          }
          filterString = filterString.toLowerCase();
          return of(this.articles.filter((element) =>
            this.orderedArticleFilterFunction(element, filterString)));
        }));
    } else {
      this.orderedArticles = [];
      this.subscription.add(this.orderedProducts$.subscribe((products) => {
        this.orderedArticles = products;
        this.search.setValue("");
      }));
      this.searchOrderedArticles$ = this.search.valueChanges.pipe(
        startWith(null), //TODO: replace this deprecated element => someday we'll have to update
        debounceTime(200),
        switchMap((filterString: string) => {
          if (!filterString) {
            return of(this.orderedArticles);
          }
          filterString = filterString.toLowerCase();
          return of(this.orderedArticles.filter((element) =>
            this.orderedArticleFilterFunction(element.article, filterString)));
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  copyButtonClicked(article: Article):
    void {
    const dialogData = ProductsListComponent.createEmptyDialogData("Produkt kopieren und hinzufügen", article);
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      const orderedArticleCreate = ProductsListComponent.mapDialogData2OrderedArticleCreate(result, article.id);
      const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdate(result);
      this.api.copyArticleAndModifyArticleArticleIdPost(article.id, articleUpdate).pipe(first())
        .subscribe((patchArticle) => {
          orderedArticleCreate.article_id = patchArticle.id;
          this.refreshAvailableOrderList();
          this.api.addOrderedArticleToOrderOrderOrderedArticleOrderIdPut(this.orderId, orderedArticleCreate)
            .pipe(first()).subscribe(() => {
            this.refreshOrderedArticleList();
          });
        });
    };
    this.openDialog(dialogData, closeFunction);
  }

  orderButtonClicked(article: Article):
    void {
    const dialogData = ProductsListComponent.createEmptyDialogData("Produkt hinzufügen", article);
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      const orderedArticleCreate = ProductsListComponent.mapDialogData2OrderedArticleCreate(result, article.id);
      const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdate(result);
      this.api.updateArticleArticleArticleIdPut(article.id, articleUpdate).pipe(first()).subscribe((patchArticle) => {
        orderedArticleCreate.article_id = patchArticle.id;
        this.api.addOrderedArticleToOrderOrderOrderedArticleOrderIdPut(this.orderId, orderedArticleCreate)
          .pipe(first()).subscribe(() => {
          this.refreshAvailableOrderList();
          this.refreshOrderedArticleList();
        });
      });
    };
    this.openDialog(dialogData, closeFunction);
  }

  openDialog(dialogData: OrderDialogData, closeFunction: (result: any) => void):
    void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: "700px",
      data: dialogData,
    });
    dialogRef.afterClosed().pipe(first()).subscribe(closeFunction);
  }

  editButtonClicked(orderedArticle: OrderedArticle):
    void {
    const dialogData$ = ProductsListComponent.createEditDialogData(orderedArticle, "Produkt bearbeiten", this.api, false);
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      if (result.delete) {
        ProductsListComponent.deleteOrderedArticle(orderedArticle.id, this.api).pipe(first()).subscribe((success) => {
          if (success) {
            this.refreshOrderedArticleList();
            this.refreshAvailableOrderList();
          } else {
            this.snackBar.open("Es ist ein Fehler aufgetreten.", "Ok", {
              duration: 10000,
            });
          }
        });
        return;
      }
      const orderedArticleCreate = ProductsListComponent
        .mapDialogData2OrderedArticleCreate(result, orderedArticle.article.id);
      const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdate(result);
      this.api.updateArticleArticleArticleIdPut(orderedArticle.article.id, articleUpdate)
        .pipe(first()).subscribe((article) => {
        orderedArticleCreate.article_id = article.id;
        this.api.updateOrderedArticleOrderedArticleOrderedArticleIdPut(orderedArticle.id, orderedArticleCreate)
          .pipe(first()).subscribe(() => {
          this.refreshOrderedArticleList();
          this.refreshAvailableOrderList();
        });
      });
    };
    dialogData$.pipe(first()).subscribe((dialogData) => {
      this.openDialog(dialogData, closeFunction);
    });
  }

  removeOrderedArticleButtonClicked(orderedArticle: OrderedArticle): void {
    this.api.deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(orderedArticle.id)
      .pipe(first()).subscribe((success) => {
      if (success) {
        this.refreshOrderedArticleList();
      } else {
        this.snackBar.open("Artikel konnte nicht gelöscht werden. Bitte probieren sie es später erneut", "Ok", {
          duration: 10000,
        });
      }
    });
  }

  removeArticleButtonClicked(article: Article): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel löschen?",
        text: "Diese Operation kann rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteArticleArticleArticleIdDelete(article.id)
          .pipe(first()).subscribe((success) => {
          if (success) {
            this.refreshAvailableOrderList();
          } else {
            this.snackBar.open("Artikel konnte nicht gelöscht werden. Bitte probieren sie es später erneut", "Ok", {
              duration: 10000,
            });
          }
        });
      }
    });
  }


  addButtonClicked(): void {
    const dialogData = ProductsListComponent.createEmptyDialogData("Neuen Artikel hinzufügen");
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      this.api.readOrderOrderOrderIdGet(this.orderId).pipe(first()).subscribe((order) => {
        const newArticle = ProductsListComponent.mapDialogData2ArticleCreate(result,
          order.order_from.type === OrderableType.Supplier ? order.order_from.id : undefined);
        this.api.createArticleArticlePost(newArticle).pipe(first()).subscribe(article => {
          const orderedArticleCreate = ProductsListComponent.mapDialogData2OrderedArticleCreate(result, article.id);
          this.api.addOrderedArticleToOrderOrderOrderedArticleOrderIdPut(this.orderId, orderedArticleCreate)
            .pipe(first()).subscribe(() => {
            this.refreshAvailableOrderList();
            this.refreshOrderedArticleList();
          });
        });
      });
    };
    this.openDialog(dialogData, closeFunction);
  }

  refreshOrderedArticleList(): void {
    this.refreshOrderedArticleListEmitter.emit();
  }

  refreshAvailableOrderList(): void {
    this.refreshAvailableArticleListEmitter.emit();
  }


  toggleFavorite(article: Article) {
    this.api.toggleArticleFavoriteArticleFavoriteArticleIdPost(article.id).pipe(first()).subscribe(newArticle => {
      article.favorite = newArticle.favorite;
    });
  }
}

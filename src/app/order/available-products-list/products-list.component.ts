import {
  Component,
  EventEmitter,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import {
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { debounceTime, first } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import {
  OrderDialogCreateData,
  OrderDialogReturnData,
  ProductEditDialogComponent,
} from "./product-edit-dialog/product-edit-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {
  DefaultService,
  OrderedArticle,
  Article,
  ArticleService, OrderedArticleService, OrderedArticleUpdateV2, OrderArticleCreateV2, ArticleCreateV2,
} from "../../../api/openapi";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  FlexModule,
} from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MatList, MatListItem } from "@angular/material/list";
import { SlicePipe } from "@angular/common";
import { BoldSpanPipe } from "../../shared/pipes/boldSearchResult";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { ArticleUpdateV2 } from "../../../api/openapi/model/articleUpdateV2";

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatButton,
    MatList,
    MatListItem,
    FlexModule,
    SlicePipe,
    BoldSpanPipe,
    CircleIconButtonComponent,
    CdkTextareaAutosize,
  ],
})
export class ProductsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() availableProducts$: Observable<Article[]>;
  @Input() orderedProducts$: Observable<OrderedArticle[]>;
  @Input() name: string;
  @Input() orderId: number;
  @Input() available: boolean;
  // This will reset the search if we need it
  @Input() resetSearchKey: unknown;

  @Output() refreshOrderedArticleListEmitter = new EventEmitter();
  @Output() refreshAvailableArticleListEmitter = new EventEmitter();
  @Output() searchChange = new EventEmitter<string>();

  search: UntypedFormControl;
  orderedArticles: OrderedArticle[];
  articles: Article[];
  subscription: Subscription;

  constructor(
    public dialog: MatDialog,
    private api: DefaultService,
    private articleService: ArticleService,
    private orderedArticlesService: OrderedArticleService,
    private snackBar: MatSnackBar,
  ) {
  }

  public static createEditDialogData(
    orderedArticle: OrderedArticle,
    title: string,
    blockRequestChange: boolean = false,
    blockFavoriteChange: boolean = false,
  ): Observable<OrderDialogCreateData> {
    return new Observable<OrderDialogCreateData>((dialogDataSubscriber) => {
      const dialogData = ProductsListComponent.createEmptyDialogData(
        title,
        orderedArticle.article,
      );
      dialogData.amount = orderedArticle.amount;
      dialogData.price = orderedArticle.price;
      dialogData.unitId = orderedArticle.ordered_unit.id;
      dialogData.request = orderedArticle.request;
      dialogData.comment = orderedArticle.comment;
      dialogData.position = orderedArticle.position;
      dialogData.favorite = orderedArticle.article.favorite;
      dialogData.modNumber = orderedArticle.modNumber;
      dialogData.createMode = false;
      dialogData.blockRequestChange = blockRequestChange;
      dialogData.blockFavoriteChange = blockFavoriteChange;
      console.log(dialogData);
      dialogDataSubscriber.next(dialogData);
    });
  }

  public static mapDialogData2ArticleUpdateV2(
    dialogData: OrderDialogReturnData,
  ): ArticleUpdateV2 {
    return {
      modNumber: dialogData.modNumber,
      price: dialogData.price,
      unitID: dialogData.unitId,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      favorite: dialogData.favorite,
    };
  }

  public static mapDialogData2OrderArticleCreateV2(
    dialogData: OrderDialogReturnData,
    orderId: number,
    articleId?: number,
  ): OrderArticleCreateV2 {
    return {
      articleId: articleId,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      comment: dialogData.comment,
      position: dialogData.position,
      modNumber: dialogData.modNumber,
      request: dialogData.request,
      amount: dialogData.amount,
      unitId: dialogData.unitId,
      price: dialogData.price,
      orderId: orderId,
      favorite: dialogData.favorite,
    };
  }

  public static mapDialogData2OrderedArticleUpdate(
    dialogData: OrderDialogReturnData,
    articleId: number,
  ): OrderedArticleUpdateV2 {
    return {
      amount: dialogData.amount,
      articleId: articleId,
      orderedUnitId: dialogData.unitId,
      price: dialogData.price,
      comment: dialogData.comment,
      position: dialogData.position,
      request: dialogData.request,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      modNumber: dialogData.modNumber,
    };
  }

  public static mapDialogData2ArticleCreateV2(
    dialogData: OrderDialogReturnData,
    supplierId: number,
  ): ArticleCreateV2 {
    return {
      supplierID: supplierId,
      modNumber: dialogData.modNumber,
      price: dialogData.price,
      unitID: dialogData.unitId,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      favorite: dialogData.favorite,
    };
  }

  private static createEmptyDialogData(
    title: string,
    article?: Article,
  ): OrderDialogCreateData {
    const base: OrderDialogCreateData = {
      title,
      amount: 0,
      name: "",
      price: 0.0,
      modNumber: "",
      unitId: 3,
      request: false,
      comment: "",
      position: "",
      createMode: true,
      favorite: false,
      blockRequestChange: false,
      blockFavoriteChange: false,
    };

    if (!article) {
      return base;
    }

    return {
      ...base,
      name: article.name.translation,
      price: article.price,
      modNumber: article.mod_number,
      favorite: article.favorite,
    };
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.search = new UntypedFormControl("");

    this.subscription.add(
      this.search.valueChanges.pipe(debounceTime(200)).subscribe((v) => {
        this.searchChange.emit((v ?? "").toString());
      }),
    );

    if (this.available) {
      this.subscription.add(
        this.availableProducts$.subscribe((products) => {
          this.articles = products ?? [];
        }),
      );
    } else {
      this.subscription.add(
        this.orderedProducts$.subscribe((products) => {
          this.orderedArticles = products ?? [];
        }),
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["resetSearchKey"] && !changes["resetSearchKey"].firstChange) {
      // Reset the input + also trigger a refresh via searchChange
      this.search?.setValue("", { emitEvent: true });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  orderButtonClicked(article: Article): void {
    const dialogData = ProductsListComponent.createEmptyDialogData(
      "Produkt hinzufügen",
      article,
    );
    const closeFunction = (result: OrderDialogReturnData | undefined) => {
      if (!result) return;
      switch (result.mode) {
        case "delete":
          return this.handleDeleteArticle(article.id);
        case "save":
          return this.handleSaveArticle(
            result,
            article.id,
          );
        case "add":
          return this.handleOrderArticle(result, article.id);
        default:
          console.error("Unknown mode: " + result.mode);
          return;
      }
    };
    this.openDialog(dialogData, closeFunction);
  }

  openDialog(
    dialogData: OrderDialogCreateData,
    closeFunction: (result: any) => void,
  ): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: "700px",
      data: dialogData,
    });
    dialogRef.afterClosed().pipe(first()).subscribe(closeFunction);
  }

  editButtonClicked(orderedArticle: OrderedArticle): void {
    const dialogData$ = ProductsListComponent.createEditDialogData(
      orderedArticle,
      "Produkt bearbeiten",
      false,
      true
    );

    const closeFunction = (result: OrderDialogReturnData | undefined) => {
      if (!result) return;

      switch (result.mode) {
        case "delete":
          return this.handleDeleteOrderedArticle(orderedArticle.id);

        case "save":
          return this.handleUpdateOrderedArticle(
            orderedArticle.id,
            result,
            orderedArticle.article.id,
          );
          case "add":
            console.error("Add mode not supported");
            break;
        default:
          console.error("Unknown mode: " + result.mode);
          return;
      }
    };

    dialogData$.pipe(first()).subscribe((dialogData) => {
      this.openDialog(dialogData, closeFunction);
    });
  }

  removeOrderedArticleButtonClicked(orderedArticle: OrderedArticle): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel aus Bestellung entfernen?",
        text: "Diese Operation kann rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.handleDeleteOrderedArticle(orderedArticle.id);
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
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.handleDeleteArticle(article.id);
      }
    });
  }

  addButtonClicked(): void {
    const dialogData = ProductsListComponent.createEmptyDialogData(
      "Neuen Artikel hinzufügen",
    );
    const closeFunction = (result: OrderDialogReturnData | undefined) => {
      if (!result) return;

      console.log(result);

      switch (result.mode) {
        case "delete":
          console.error("Delete mode not supported");
          break;

        case "save":
          this.handleCreateArticle(result, this.api);
          break;
        case "add":
          return this.handleOrderArticle(result, undefined);
        default:
          console.error("Unknown mode: " + result.mode);
          return;
      }
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
    this.api
      .toggleArticleFavoriteArticleFavoriteArticleIdPost(article.id)
      .pipe(first())
      .subscribe((newArticle) => {
        article.favorite = newArticle.favorite;
      });
  }

  private refreshBothLists(): void {
    this.refreshOrderedArticleList();
    this.refreshAvailableOrderList();
  }

  private handleOrderArticle(
    result: OrderDialogReturnData,
    articleId: number
  ) {
    const orderedArticleCreate =
      ProductsListComponent.mapDialogData2OrderArticleCreateV2(
        result,
        this.orderId,
        articleId,
      );
    this.orderedArticlesService.orderArticle(orderedArticleCreate)
      .pipe(first())
      .subscribe(() => {
        this.refreshBothLists();
      });
  }

  private handleCreateArticle(
    result: OrderDialogReturnData,
    api: DefaultService
  ) {
    api.readOrderOrderOrderIdGet(this.orderId)
      .pipe(first())
      .subscribe((order) => {
        const articleCreate = ProductsListComponent.mapDialogData2ArticleCreateV2(
          result,
          order.order_from.id,
        );
        this.articleService.createArticle(articleCreate).pipe(first()).subscribe(() => {
          this.refreshBothLists();
        })
      });

  }



  private handleDeleteArticle(articleId: number): void {
    this.api
      .deleteArticleArticleArticleIdDelete(articleId)
      .pipe(first())
      .subscribe((success) => {
        if (success) {
          this.refreshAvailableOrderList();
        } else {
          this.snackBar.open(
            "Artikel konnte nicht gelöscht werden. Bitte probieren sie es später erneut",
            "Ok",
            {
              duration: 10000,
            },
          );
        }
      });
  }

  private handleDeleteOrderedArticle(orderedArticleId: number): void {
    this.api
      .deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(orderedArticleId)
      .pipe(first())
      .subscribe((success) => {
        if (success) {
          this.refreshBothLists();
          return;
        }
        this.snackBar.open("Es ist ein Fehler aufgetreten.", "Ok", { duration: 10000 });
      });
  }

  private handleUpdateOrderedArticle(
    orderedArticleId: number,
    result: OrderDialogReturnData,
    articleId: number,
  ): void {
    const orderedArticleUpdate = ProductsListComponent.mapDialogData2OrderedArticleUpdate(result, articleId);
    this.orderedArticlesService
      .updateOrderedArticle(orderedArticleId, orderedArticleUpdate)
      .pipe(first())
      .subscribe(() => this.refreshBothLists());
  }

  private handleSaveArticle(
    result: OrderDialogReturnData,
    articleId?: number,
  ): void {
    const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdateV2(result);
    this.articleService
      .updateArticle(articleId, articleUpdate)
      .pipe(first())
      .subscribe(() => this.refreshBothLists());
  }
}

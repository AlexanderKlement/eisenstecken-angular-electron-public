import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { debounceTime, first } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import {
  OrderDialogCreateData,
  OrderDialogReturnData,
  ProductEditDialogComponent
} from "./product-edit-dialog/product-edit-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {
  Article,
  ArticleCreateV2,
  ArticleService,
  ArticleUpdateV2,
  DefaultService,
  OrderArticleCreateV2,
  OrderedArticle,
  OrderedArticleService
} from "../../../api/openapi";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MatList, MatListItem } from "@angular/material/list";
import { SlicePipe } from "@angular/common";
import { BoldSpanPipe } from "../../shared/pipes/boldSearchResult";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { OrderedArticleEditDialogService } from "./product-edit-dialog/product-edit-dialog.service";

@Component({
  selector: "app-products-list",
  templateUrl: "./products-list.component.html",
  styleUrls: ["./products-list.component.scss"],
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
    CdkTextareaAutosize
  ]
})
export class ProductsListComponent implements OnInit, OnDestroy, OnChanges {
  dialog = inject(MatDialog);
  private api = inject(DefaultService);
  private articleService = inject(ArticleService);
  private orderedArticlesService = inject(OrderedArticleService);
  private snackBar = inject(MatSnackBar);
  private orderedArticleEditDialog = inject(OrderedArticleEditDialogService);

  @Input() availableProducts$: Observable<Article[]>;
  @Input({}) orderedProducts$: Observable<OrderedArticle[]>;
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

  public static mapDialogData2ArticleUpdateV2(
    dialogData: OrderDialogReturnData
  ): ArticleUpdateV2 {
    return {
      modNumber: dialogData.modNumber,
      price: dialogData.price,
      unitID: dialogData.unitId,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      favorite: dialogData.favorite
    };
  }

  public static mapDialogData2OrderArticleCreateV2(
    dialogData: OrderDialogReturnData,
    orderId: number,
    articleId?: number
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
      favorite: dialogData.favorite
    };
  }

  public static mapDialogData2ArticleCreateV2(
    dialogData: OrderDialogReturnData,
    supplierId?: number,
    stockId?: number
  ): ArticleCreateV2 {
    return {
      supplierID: supplierId,
      modNumber: dialogData.modNumber,
      price: dialogData.price,
      unitID: dialogData.unitId,
      nameDE: dialogData.name,
      nameIT: dialogData.name,
      favorite: dialogData.favorite,
      stockId: stockId
    };
  }

  private static createEmptyDialogData(
    title: string,
    article?: Article
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
      blockFavoriteChange: false
    };

    if (!article) {
      return base;
    }

    return {
      ...base,
      name: article.name.translation,
      price: article.price,
      modNumber: article.mod_number,
      favorite: article.favorite
    };
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.search = new UntypedFormControl("");

    this.subscription.add(
      this.search.valueChanges.pipe(debounceTime(200)).subscribe((v) => {
        this.searchChange.emit((v ?? "").toString());
      })
    );

    if (this.available) {
      this.subscription.add(
        this.availableProducts$.subscribe((products) => {
          this.articles = products ?? [];
        })
      );
    } else {
      this.subscription.add(
        this.orderedProducts$.subscribe((products) => {
          this.orderedArticles = products ?? [];
        })
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
      article
    );
    const closeFunction = (result: OrderDialogReturnData | undefined) => {
      if (!result) return;
      switch (result.mode) {
        case "delete":
          return this.handleDeleteArticle(article.id);
        case "save":
          return this.handleSaveArticle(
            result,
            article.id
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
    closeFunction: (result: any) => void
  ): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: "700px",
      data: dialogData
    });
    dialogRef.afterClosed().pipe(first()).subscribe(closeFunction);
  }

  editButtonClicked(orderedArticle: OrderedArticle): void {
    this.orderedArticleEditDialog.openEditDialog(orderedArticle, {
      title: "Produkt bearbeiten",
      blockRequestChange: false,
      blockFavoriteChange: true,
      onSuccess: () => this.refreshBothLists()
    });
  }

  removeOrderedArticleButtonClicked(orderedArticle: OrderedArticle): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel aus Bestellung entfernen?",
        text: "Diese Operation kann rückgängig gemacht werden."
      }
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
        text: "Diese Operation kann rückgängig gemacht werden."
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.handleDeleteArticle(article.id);
      }
    });
  }

  addButtonClicked(): void {
    const dialogData = ProductsListComponent.createEmptyDialogData(
      "Neuen Artikel hinzufügen"
    );
    const closeFunction = (result: OrderDialogReturnData | undefined) => {
      if (!result) return;

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
        articleId
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
        let supplierId: number | undefined = undefined;
        let stockId: number | undefined = undefined;
        if (order.order_from.type == "supplier") {
          supplierId = order.order_from.id;
        }
        if (order.order_from.type == "stock") {
          stockId = order.order_from.id;
        }
        const articleCreate = ProductsListComponent.mapDialogData2ArticleCreateV2(
          result,
          supplierId,
          stockId
        );
        console.log("ArticleCreate:");
        console.log(articleCreate);
        console.log("Result:");
        console.log(result);
        this.articleService.createArticle(articleCreate).pipe(first()).subscribe(() => {
          this.refreshBothLists();
        });
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
              duration: 10000
            }
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

  private handleSaveArticle(
    result: OrderDialogReturnData,
    articleId?: number
  ): void {
    const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdateV2(result);
    this.articleService
      .updateArticle(articleId, articleUpdate)
      .pipe(first())
      .subscribe(() => this.refreshBothLists());
  }
}

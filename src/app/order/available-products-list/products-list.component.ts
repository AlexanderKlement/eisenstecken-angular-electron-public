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
  OrderDialogData,
  ProductEditDialogComponent,
} from "./product-edit-dialog/product-edit-dialog.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import {
  DefaultService,
  OrderedArticle,
  Article,
  ArticleUpdateFull,
  OrderedArticleCreate,
  OrderArticleCreateV2,
  ArticleService,
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
    private snackBar: MatSnackBar,
  ) {
  }

  public static createEditDialogData(
    orderedArticle: OrderedArticle,
    title: string,
    blockRequestChange: boolean = false,
  ): Observable<OrderDialogData> {
    return new Observable<OrderDialogData>((dialogDataSubscriber) => {
      const dialogData = ProductsListComponent.createEmptyDialogData(
        title,
        orderedArticle.article,
      );
      dialogData.amount = orderedArticle.amount;
      dialogData.price = orderedArticle.price;
      dialogData.unit_id = orderedArticle.ordered_unit.id;
      dialogData.request = orderedArticle.request;
      dialogData.comment = orderedArticle.comment;
      dialogData.position = orderedArticle.position;
      dialogData.favorite = orderedArticle.article.favorite;
      dialogData.create = false;
      dialogData.blockRequestChange = blockRequestChange;

      console.log(dialogData);
      dialogDataSubscriber.next(dialogData);
    });
  }

  public static deleteOrderedArticle(
    orderedArticleId: number,
    api: DefaultService,
  ): Observable<boolean> {
    return api.deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(
      orderedArticleId,
    );
  }

  public static mapDialogData2ArticleUpdate(
    dialogData: OrderDialogData,
  ): ArticleUpdateFull {
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
      category_ids: [],
      favorite: dialogData.favorite,
    };
  }

  public static mapDialogData2OrderArticleCreateV2(
    dialogData: OrderDialogData,
    orderId: number,
    articleId?: number,
  ): OrderArticleCreateV2 {
    return {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      articleId: articleId,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      nameDe: dialogData.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      nameIt: dialogData.name,
      comment: dialogData.comment,
      position: dialogData.position,
      modNumber: dialogData.mod_number,
      request: dialogData.request,
      amount: dialogData.amount,
      unitId: dialogData.unit_id,
      price: dialogData.price,
      orderId: orderId,
      favorite: dialogData.favorite,
    };
  }

  public static mapDialogData2OrderedArticleCreate(
    dialogData: OrderDialogData,
    articleId: number,
  ): OrderedArticleCreate {
    return {
      amount: dialogData.amount,
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

  private static createEmptyDialogData(
    title: string,
    article?: Article,
  ): OrderDialogData {
    if (article === undefined) {
      return {
        title,
        amount: 0,
        name: "",
        price: 0.0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        mod_number: "",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: 3,
        request: false,
        comment: "",
        position: "",
        delete: false,
        create: true,
        favorite: false,
        blockRequestChange: false,
      };
    }
    return {
      title,
      amount: 0,
      name: article.name.translation,
      price: article.price,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: article.mod_number,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: 3,
      request: false,
      comment: "",
      position: "",
      delete: false,
      create: true,
      favorite: article.favorite,
      blockRequestChange: false,
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
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      const orderedArticleCreate =
        ProductsListComponent.mapDialogData2OrderArticleCreateV2(
          result,
          this.orderId,
          article.id,
        );
      this.articleService.orderArticle(orderedArticleCreate)
        .pipe(first())
        .subscribe(() => {
          this.refreshAvailableOrderList();
          this.refreshOrderedArticleList();
        });
    };
    this.openDialog(dialogData, closeFunction);
  }

  openDialog(
    dialogData: OrderDialogData,
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
    );
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      if (result.delete) {
        ProductsListComponent.deleteOrderedArticle(orderedArticle.id, this.api)
          .pipe(first())
          .subscribe((success) => {
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
      const orderedArticleCreate =
        ProductsListComponent.mapDialogData2OrderedArticleCreate(
          result,
          orderedArticle.article.id,
        );
      const articleUpdate =
        ProductsListComponent.mapDialogData2ArticleUpdate(result);
      this.api
        .updateArticleArticleArticleIdPut(
          orderedArticle.article.id,
          articleUpdate,
        )
        .pipe(first())
        .subscribe((article) => {
          orderedArticleCreate.article_id = article.id;
          this.api
            .updateOrderedArticleOrderedArticleOrderedArticleIdPut(
              orderedArticle.id,
              orderedArticleCreate,
            )
            .pipe(first())
            .subscribe(() => {
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
    this.api
      .deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(
        orderedArticle.id,
      )
      .pipe(first())
      .subscribe((success) => {
        if (success) {
          this.refreshOrderedArticleList();
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

  removeArticleButtonClicked(article: Article): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel löschen?",
        text: "Diese Operation kann rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api
          .deleteArticleArticleArticleIdDelete(article.id)
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
    });
  }

  addButtonClicked(): void {
    const dialogData = ProductsListComponent.createEmptyDialogData(
      "Neuen Artikel hinzufügen",
    );
    const closeFunction = (result: any) => {
      if (result === undefined) {
        return;
      }
      const orderedArticleCreate =
        ProductsListComponent.mapDialogData2OrderArticleCreateV2(
          result,
          this.orderId,
          null
        );
      this.articleService.orderArticle(orderedArticleCreate)
        .pipe(first())
        .subscribe(() => {
          this.refreshAvailableOrderList();
          this.refreshOrderedArticleList();
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
    this.api
      .toggleArticleFavoriteArticleFavoriteArticleIdPost(article.id)
      .pipe(first())
      .subscribe((newArticle) => {
        article.favorite = newArticle.favorite;
      });
  }
}

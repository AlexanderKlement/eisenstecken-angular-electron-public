import { Component, ComponentRef, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InfoDataSource } from "../../shared/components/info-builder/info-builder.datasource";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { first } from "rxjs/operators";
import { ProductsListComponent } from "../available-products-list/products-list.component";
import {
  ProductEditDialogComponent,
} from "../available-products-list/product-edit-dialog/product-edit-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomButton } from "../../shared/components/toolbar/toolbar.component";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { OrderedArticleMoveDialogComponent } from "./ordered-article-move-dialog/ordered-article-move-dialog.component";
import { formatCurrency } from "@angular/common";
import { Observable, Subscriber } from "rxjs";
import { ConvertRequestDialogComponent } from "./convert-request-dialog/convert-request-dialog.component";
import { DefaultService, OrderedArticle, Order, OrderableType } from "../../../api/openapi";

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    standalone: false
})
export class OrderDetailComponent implements OnInit {
  articleDataSource: TableDataSource<OrderedArticle>;
  infoDataSource: InfoDataSource<Order>;

  orderId: number;
  gotoNavigationTarget = "";

  public $refresh: Observable<void>;
  buttons: CustomButton[] = [
    {
      name: "Löschen",
      navigate: (): void => {
        this.orderDeleteClicked();
      },
    },
    {
      name: "Artikel verschieben",
      navigate: (): void => {
        this.moveOrderedArticlesClicked();
      },
    },
  ];
  private $refreshSubscriber: Subscriber<void>;

  constructor(private api: DefaultService, private route: ActivatedRoute, private router: Router,
              private dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  public static extractOrderToolTips(dataSource: Order): string {
    let toolTipString = "";
    for (const article of dataSource.articles) {
      toolTipString += article.article.name.translation + " - ";
    }
    return toolTipString.substring(0, toolTipString.length - 3);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.orderId = parseInt(params.id, 10);
      if (isNaN(this.orderId)) {
        console.error("Cannot parse given id");
        this.router.navigate(["supplier"]);
        return;
      }
      this.initArticleDataSource();
      this.initInfoDataSource();
      this.initGoToButton();
      this.api.readOrderOrderOrderIdGet(this.orderId).pipe(first()).subscribe((order) => {
        if (order.articles.length > 0 && order.articles.at(0).request) {
          this.buttons.push(
            {
              name: "Anfragen bestellen",
              navigate: (): void => {
                this.convertArticlesClicked();
              },
            });
        }
      });
    });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    this.$refreshSubscriber.next();
  }

  private initInfoDataSource(): void {
    this.infoDataSource = new InfoDataSource<Order>(
      this.api.readOrderOrderOrderIdGet(this.orderId),
      [
        {
          property: "order_from.name",
          name: "Lieferant",
        },
        {
          property: "order_to.name",
          name: "Empfänger",
        },
      ],
      "/order/" + this.orderId.toString(),
      undefined,
      undefined,
      undefined,
    );

  }

  private initArticleDataSource(): void {
    this.articleDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrderedArticlesByOrderOrderedArticleOrderOrderIdGet(this.orderId, skip, limit, filter, true),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "article.name.translation_de": dataSource.article.name.translation_de,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                custom_description: dataSource.custom_description,
                position: dataSource.position,
                amount: dataSource.amount,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                "ordered_unit.name.translation_de": dataSource.ordered_unit.name.translation_de,
                price: formatCurrency(dataSource.price, "de-DE", "EUR"),
                discount: formatCurrency(dataSource.price * dataSource.amount *
                  (1 - dataSource.discount / 100), "de-DE", "EUR"),
              },
              route: () => {
                this.orderedArticleClicked(dataSource.id);
              },
            });
        });
        return rows;
      },
      [
        { name: "article.name.translation_de", headerName: "Name" },
        { name: "custom_description", headerName: "Beschreibung" },
        { name: "position", headerName: "Position" },
        { name: "amount", headerName: "Menge" },
        { name: "ordered_unit.name.translation_de", headerName: "Einheit" },
        { name: "price", headerName: "Einzelpreis" },
        { name: "discount", headerName: "Gesamtpreis" },
      ],
      (api) => api.readOrderedArticleCountByOrderOrderedArticleOrderOrderIdCountGet(this.orderId),
    );
    this.articleDataSource.loadData();
  }

  private orderedArticleClicked(id: number): void {
    this.api.readOrderedArticleOrderedArticleOrderedArticleIdGet(id).pipe(first()).subscribe((orderedArticle) => {
      const dialogData$ = ProductsListComponent.createEditDialogData(orderedArticle, "Produkt bearbeiten", this.api, true);
      const closeFunction = (result: any) => {
        if (result === undefined) {
          return;
        }
        if (result.delete) {
          ProductsListComponent.deleteOrderedArticle(orderedArticle.id, this.api).pipe(first()).subscribe((success) => {
            if (success) {
              this.articleDataSource.loadData();
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
            this.articleDataSource.loadData();
          });
        });
      };
      dialogData$.pipe(first()).subscribe((dialogData) => {
        const dialogRef = this.dialog.open(ProductEditDialogComponent, {
          width: "700px",
          data: dialogData,
        });
        dialogRef.afterClosed().pipe(first()).subscribe(closeFunction);
      });
    });
  }

  private orderDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Bestellung löschen?",
        text: "Bestellung wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden!",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteOrderOrderOrderIdDelete(this.orderId).pipe(first()).subscribe(success => {
          if (success) {
            this.articleDataSource.loadData();
          } else {
            this.snackBar.open("Bestellung konnte nicht gelöscht werden", "Ok", {
              duration: 10000,
            });
            console.error("Could not delete order");
          }
        });

      }
    });
  }

  private gotoButtonClicked() {
    this.router.navigateByUrl(this.gotoNavigationTarget);
  }

  private initGoToButton(): void {
    this.api.readOrderOrderOrderIdGet(this.orderId).pipe(first()).subscribe((order) => {
      if (order.order_from.type === OrderableType.Supplier) {
        this.buttons.push({
          name: "Gehe zu Lieferant",
          navigate: (): void => {
            this.gotoButtonClicked();
          },
        });
        this.gotoNavigationTarget = "supplier/" + order.order_from.id.toString();
      } else {
        this.buttons.push({
          name: "Gehe zu Lager",
          navigate: (): void => {
            this.gotoButtonClicked();
          },
        });
        this.gotoNavigationTarget = "stock/" + order.order_from.id.toString();
      }
    });
  }

  private convertArticlesClicked() {
    const dialogRef = this.dialog.open(ConvertRequestDialogComponent, {
      width: "800px",
      data: {
        orderId: this.orderId,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleDataSource.loadData();
      }
    });
  }

  private moveOrderedArticlesClicked() {
    const dialogRef = this.dialog.open(OrderedArticleMoveDialogComponent, {
      width: "800px",
      data: {
        orderId: this.orderId,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.success) {
        this.articleDataSource.loadData();
      }
    });
  }
}

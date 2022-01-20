import {Component, OnInit} from '@angular/core';
import {DefaultService, Order, OrderBundle, OrderedArticle} from 'eisenstecken-openapi-angular-library';
import {ActivatedRoute, Router} from '@angular/router';
import {InfoDataSource} from '../../shared/components/info-builder/info-builder.datasource';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import {first} from 'rxjs/operators';
import {ProductsListComponent} from '../available-products-list/products-list.component';
import {ProductEditDialogComponent} from '../available-products-list/product-edit-dialog/product-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
    articleDataSource: TableDataSource<OrderedArticle>;
    infoDataSource: InfoDataSource<Order>;

    orderId: number;

    constructor(private api: DefaultService, private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.orderId = parseInt(params.id, 10);
            if (isNaN(this.orderId)) {
                console.error('Cannot parse given id');
                this.router.navigate(['supplier']);
                return;
            }
            this.initArticleDataSource();
            this.initInfoDataSource();
        });
    }

    private initInfoDataSource(): void {
        this.infoDataSource = new InfoDataSource<Order>(
            this.api.readOrdersOrderOrderIdGet(this.orderId),
            [
                {
                    property: 'order_from.name',
                    name: 'Lieferant'
                },
                {
                    property: 'order_to.name',
                    name: 'Empfänger'
                },
                {
                    property: 'user.fullname',
                    name: 'Bestellung versendet:'
                },
                {
                    property: 'create_date',
                    name: 'Erstelldatum'
                },
            ],
            '/order/' + this.orderId.toString(),
            undefined,
            undefined,
            undefined
        );

    }

    private initArticleDataSource(): void {
        this.articleDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readOrderedArticlesByOrderOrderedArticleOrderOrderIdGet(this.orderId, skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'article.name.translation_de': dataSource.article.name.translation_de,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                custom_description: dataSource.custom_description,
                                amount: dataSource.amount,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'article.unit.name.translation_de': dataSource.article.unit.name.translation_de,
                                price: dataSource.price,
                                discount: dataSource.price * dataSource.amount - dataSource.discount,
                            },
                            route: () => {
                                this.orderedArticleClicked(dataSource.id);
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'article.name.translation_de', headerName: 'Name'},
                {name: 'custom_description', headerName: 'Beschreibung'},
                {name: 'amount', headerName: 'Menge'},
                {name: 'article.unit.name.translation_de', headerName: 'Einheit'},
                {name: 'price', headerName: 'Einzelpreis [€]'},
                {name: 'discount', headerName: 'Gesamtpreis [€]'}
            ],
            (api) => api.readOrderedArticleCountByOrderOrderedArticleOrderOrderIdCountGet(this.orderId)
        );
        this.articleDataSource.loadData();
    }

    private orderedArticleClicked(id: number): void {
        this.api.readOrderedArticleOrderedArticleOrderedArticleIdGet(id).pipe(first()).subscribe((orderedArticle) => {
            const dialogData$ = ProductsListComponent.createEditDialogData(orderedArticle, 'Produkt bearbeiten', this.api);
            const closeFunction = (result: any) => {
                if (result === undefined) {
                    return;
                }
                if (result.delete) {
                    ProductsListComponent.deleteOrderedArticle(orderedArticle.id, this.api).pipe(first()).subscribe((success) => {
                        if (success) {
                            this.articleDataSource.loadData();
                        } else {
                            this.snackBar.open('Es ist ein Fehler aufgetreten.', 'Ok', {
                                duration: 10000
                            });
                        }
                    });
                    return;
                }
                const orderedArticleCreate = ProductsListComponent
                    .mapDialogData2OrderedArticleCreate(result, orderedArticle.article.id);
                const articleUpdate = ProductsListComponent.mapDialogData2ArticleUpdate(result);
                this.api.patchArticleArticleArticleIdPatch(orderedArticle.article.id, articleUpdate)
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
                    width: '700px',
                    data: dialogData
                });
                dialogRef.afterClosed().pipe(first()).subscribe(closeFunction);
            });
        });
    }

}

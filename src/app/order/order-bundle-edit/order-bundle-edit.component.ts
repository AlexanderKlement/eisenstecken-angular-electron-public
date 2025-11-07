import { Component, OnInit } from "@angular/core";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { OrderBundle, DefaultService, Order, Lock, OrderedArticlePriceUpdate } from "../../../api/openapi";

@Component({
  selector: 'app-order-bundle-edit',
  templateUrl: './order-bundle-edit.component.html',
  styleUrls: ['./order-bundle-edit.component.scss'],
  standalone: false,
})
export class OrderBundleEditComponent extends BaseEditComponent<OrderBundle> implements OnInit {

  orderBundleId: number;
  navigationTarget = "supplier";
  orderBundleGroup: UntypedFormGroup;

  constructor(api: DefaultService, router: Router, route: ActivatedRoute, private snackbar: MatSnackBar, private dialog: MatDialog) {
    super(api, router, route);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> => api.islockedOrderBundleOrderBundleIslockedOrderBundleIdGet(id);

  dataFunction = (api: DefaultService, id: number): Observable<OrderBundle> => api.readOrderBundleOrderBundleOrderBundleIdGet(id);

  unlockFunction = (api: DefaultService, id: number): Observable<boolean> => api.unlockOrderBundleOrderBundleUnlockOrderBundleIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.initOrderBundleGroup();
    this.routeParams.subscribe((params) => {
      this.orderBundleId = parseInt(params.id, 10);
      if (isNaN(this.orderBundleId)) {
        console.error("OrderBundleEdit: Cannot determine id");
        this.router.navigateByUrl(this.navigationTarget);
      }
      this.navigationTarget = "job/" + this.orderBundleId.toString();
      this.loadOrders();
    });

  }

  loadOrders(): void {
    this.api.readOrdersByOrderBundleOrderBundleOrdersOrderBundleIdGet(this.orderBundleId).pipe(first()).subscribe(orders => {
      for (const order of orders) {
        this.getOrderFormArray().push(this.initOrder(order));
      }
    });
  }

  initOrderBundleGroup() {
    this.orderBundleGroup = new UntypedFormGroup({
      orders: new UntypedFormArray([]),
    });
  }

  getOrderFormArray(): UntypedFormArray {
    return this.orderBundleGroup.get("orders") as UntypedFormArray;
  }

  getArticlesAt(index: number): UntypedFormArray {
    return this.getOrderFormArray().at(index).get("articles") as UntypedFormArray;
  }

  initOrder(order: Order): UntypedFormGroup {
    const articleFormArray = new UntypedFormArray([]);
    for (const article of order.articles) {
      articleFormArray.push(new UntypedFormGroup({
        id: new UntypedFormControl(article.id),
        name: new UntypedFormControl(article.article.name.translation_de),
        amount: new UntypedFormControl(article.amount),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        mod_number: new UntypedFormControl(article.article.mod_number),
        unit: new UntypedFormControl(article.ordered_unit.name.translation_de),
        price: new UntypedFormControl(article.price),
      }));
    }

    return new UntypedFormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      order_from: new UntypedFormControl(order.order_from.displayable_name),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      order_to: new UntypedFormControl(order.order_to.displayable_name),
      articles: articleFormArray,
    });
  }

  onSubmit(): void {
    const priceUpdate: OrderedArticlePriceUpdate[] = [];
    for (const order of this.getOrderFormArray().controls) {
      for (const article of (order.get("articles") as UntypedFormArray).controls) {
        priceUpdate.push({
          id: parseInt(article.get("id").value, 10),
          price: parseFloat(article.get("price").value),
        });
      }
    } //This does not work anymore
    this.api.updateOrderedArticlePriceOrderedArticlePricePut(priceUpdate).pipe(first()).subscribe(result => {
      if (result) {
        this.router.navigateByUrl("order_bundle/" + this.orderBundleId.toString());
      } else {
        console.error("OrderBundleEdit: Could not update all prices");
      }
    });
  }

  onRemoveArticleClick(i: number, j: number): void {
    const articles = this.getArticlesAt(i);
    const article = articles.at(j);
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(article.get("id").value).pipe(first())
          .subscribe(success => {
            if (success) {
              articles.removeAt(j);
            } else {
              this.snackbar.open("Der Artikel konnte leider nicht gelöscht werden. Bitte probieren sie es später erneut"
                , "Ok", {
                  duration: 10000,
                });
            }
          });
      }
    });
  }

  protected observableReady() {
    super.observableReady();
  }


}

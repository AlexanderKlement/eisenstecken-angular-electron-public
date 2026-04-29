import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { Lock, Stock, StockCreate, StockUpdate } from "../../../api/openapi";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-stock-edit",
  templateUrl: "./stock-edit.component.html",
  styleUrls: ["./stock-edit.component.scss"],
  imports: [
    ToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton
  ]
})
export default class StockEditComponent extends BaseEditComponent<Stock> implements OnInit, OnDestroy {
  stockGroup: UntypedFormGroup;
  navigationTarget = "stock";
  title = "Lager: Bearbeiten";


  lockFunction = (id: number): Observable<Lock> => this.api.islockedStockStockIslockedStockIdGet(id);
  dataFunction = (id: number): Observable<Stock> => this.api.readStockStockStockIdGet(id);
  unlockFunction = (id: number): Observable<boolean> => this.api.unlockStockStockUnlockStockIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.initStockGroup();
    if (!this.createMode) {
      this.api.readStockStockStockIdGet(this.id).pipe(first()).subscribe(stock => {
        this.stockGroup.get("name").setValue(stock.name);
      });
    }
    if (this.createMode) {
      this.title = "Lager: Erstellen";
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSubmit(): void {
    this.submitted = true;


    if (this.createMode) {
      const stockCreate: StockCreate = {
        name: this.stockGroup.get("name").value
      };

      this.api.createStockStockPost(stockCreate).subscribe((stock) => {
        this.createUpdateSuccess(stock);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    } else {
      const stockUpdate: StockUpdate = {
        name: this.stockGroup.get("name").value
      };

      this.api.updateStockStockStockIdPut(this.id, stockUpdate).subscribe((stock) => {
        this.createUpdateSuccess(stock);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    }
  }

  createUpdateSuccess(stock: Stock): void {
    this.id = stock.id;
    if (this.createMode) {
      this.router.navigateByUrl("supplier/", { replaceUrl: true });
    } else {
      this.router.navigateByUrl("stock/" + stock.id.toString(), { replaceUrl: true });
    }
  }

  private initStockGroup(): void {
    this.stockGroup = new UntypedFormGroup({
      name: new UntypedFormControl("")
    });
  }


}

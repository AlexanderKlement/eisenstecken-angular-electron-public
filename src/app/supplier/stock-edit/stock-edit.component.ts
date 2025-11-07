import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BaseEditComponent } from '../../shared/components/base-edit/base-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { NavigationService } from '../../shared/services/navigation.service';
import { DefaultService, Lock, Stock, StockCreate, StockUpdate } from '../../../api/openapi';
import { BackStackService } from '../../src/app/shared/services/back-stack.service';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.scss'],
  standalone: false,
})
export class StockEditComponent extends BaseEditComponent<Stock> implements OnInit, OnDestroy {
  stockGroup: UntypedFormGroup;
  navigationTarget = 'stock';
  title = 'Lager: Bearbeiten';

  constructor(api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog, backStack: BackStackService, navigation: NavigationService) {
    super(api, router, route, dialog, backStack, navigation);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> => api.islockedStockStockIslockedStockIdGet(id);
  dataFunction = (api: DefaultService, id: number): Observable<Stock> => api.readStockStockStockIdGet(id);
  unlockFunction = (api: DefaultService, id: number): Observable<boolean> => api.unlockStockStockUnlockStockIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.initStockGroup();
    if (!this.createMode) {
      this.api.readStockStockStockIdGet(this.id).pipe(first()).subscribe(stock => {
        this.stockGroup.get('name').setValue(stock.name);
      });
    }
    if (this.createMode) {
      this.title = 'Lager: Erstellen';
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSubmit(): void {
    this.submitted = true;


    if (this.createMode) {
      const stockCreate: StockCreate = {
        name: this.stockGroup.get('name').value,
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
        name: this.stockGroup.get('name').value,
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
      this.navigation.replaceCurrentWith(`supplier`);
    } else {
      this.navigation.replaceCurrentWith('stock/' + stock.id.toString());
    }
  }

  private initStockGroup(): void {
    this.stockGroup = new UntypedFormGroup({
      name: new UntypedFormControl(''),
    });
  }


}

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {DefaultService, Unit, Vat} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CurrencyPipe, formatNumber, getLocaleCurrencyCode} from '@angular/common';

export interface OrderDialogData {
  title: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  custom_description: string;
  amount: number;
  discount: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  unit_id?: number;
  price: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mod_number: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  vat_id: number;
  request: boolean;
  comment: string;
  position: string;
  delete: boolean;
  create: boolean;
  blockRequestChange: boolean;
}

@Component({
  selector: 'app-product-edit-dialog',
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.scss']
})
export class ProductEditDialogComponent implements OnInit, OnDestroy {

  vatOptions$: Observable<Vat[]>;
  unitOptions$: Observable<Unit[]>;
  productEditGroup: FormGroup;
  subscription: Subscription;
  priceSubscription: Subscription;
  singlePrice = true;
  createMode: boolean;
  blockRequestChange = false;

  constructor(public dialogRef: MatDialogRef<ProductEditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: OrderDialogData, private api: DefaultService,
              private currency: CurrencyPipe) {
  }

  public static roundTo2Decimals(input: number): number {
    //TODO: move bitch get out the way
    // -> i guess i was trying to say: move this to a utils class
    return Math.round(input * 100) / 100;
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.priceSubscription = new Subscription();
    this.vatOptions$ = this.api.readVatsVatGet();
    this.unitOptions$ = this.api.readUnitsUnitGet();
    this.blockRequestChange = this.data.blockRequestChange;
    this.initProductEditGroup();
    this.createMode = this.data.create;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.priceSubscription.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddClick(): void {
    this.dialogRef.close(this.getReturnData(false));
  }

  onDeleteClick(): void {
    this.dialogRef.close(this.getReturnData(true));
  }

  transformAmount(): void {
    const price = parseFloat(this.productEditGroup.get('priceFormatted').value
      .replace('€', '').replace('.', '').replace(',', '.'));
    const formattedAmount = this.currency.transform(price, getLocaleCurrencyCode('de_DE'));
    this.productEditGroup.get('price').setValue(price);
    this.productEditGroup.get('priceFormatted').setValue(formattedAmount);
  }

  private getReturnData(deleteOrder: boolean): OrderDialogData {
    return {
      title: this.productEditGroup.get('title').value,
      name: this.productEditGroup.get('name').value,
      description: this.productEditGroup.get('description').value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      custom_description: this.productEditGroup.get('custom_description').value,
      amount: this.productEditGroup.get('amount').value,
      discount: this.productEditGroup.get('discount').value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: this.productEditGroup.get('unit_id').value,
      price: this.singlePrice ? this.productEditGroup.get('price').value : this.calcSinglePrice(),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: this.productEditGroup.get('mod_number').value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: this.productEditGroup.get('vat_id').value,
      request: this.productEditGroup.get('request').value,
      comment: this.productEditGroup.get('comment').value,
      position: this.productEditGroup.get('position').value,
      delete: deleteOrder,
      create: this.data.create,
      blockRequestChange: this.blockRequestChange,
    };
  }

  private initProductEditGroup(): void {
    console.log(this.data.unit_id);
    this.productEditGroup = new FormGroup({
      title: new FormControl(this.data.title),
      name: new FormControl(this.data.name, Validators.required),
      description: new FormControl(this.data.description),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      custom_description: new FormControl(this.data.custom_description),
      amount: new FormControl(this.data.amount, Validators.min(0.0000001)),
      discount: new FormControl(this.data.discount, Validators.min(0)),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: new FormControl(this.data.unit_id !== null ? this.data.unit_id : 3),
      price: new FormControl(this.data.price, Validators.min(0)),
      priceFormatted: new FormControl(this.currency.transform(this.data.price, getLocaleCurrencyCode('de_DE'))),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: new FormControl(this.data.mod_number),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: new FormControl(this.data.vat_id),
      request: new FormControl(this.data.request),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      total_price: new FormControl(0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price_insert: new FormControl(true),
      comment: new FormControl(this.data.comment),
      position: new FormControl(this.data.position)
    });
    this.subscription.add(this.productEditGroup.get('amount').valueChanges.subscribe(() => {
      this.recalculateTotalPrice();
    }));
    this.subscription.add(this.productEditGroup.get('discount').valueChanges.subscribe(() => {
      this.recalculateTotalPrice();
    }));
    this.priceSubscription.add(this.productEditGroup.get('price').valueChanges.subscribe(() => {
      this.recalculateTotalPrice();
    }));
    this.subscription.add(this.productEditGroup.get('single_price_insert').valueChanges.subscribe(() => {
      this.singlePriceInsertChanged();
    }));
    this.recalculateTotalPrice();
  }

  private calcSinglePrice(): number {
    const price = this.productEditGroup.get('total_price').value / (1 - (this.productEditGroup.get('discount').value / 100));
    return price / this.productEditGroup.get('amount').value;
  }

  private calcTotalPrice(): number {
    const price = this.productEditGroup.get('price').value * this.productEditGroup.get('amount').value;
    return price * (1 - (this.productEditGroup.get('discount').value / 100));
  }

  private recalculateTotalPrice(): void {
    if (this.singlePrice) {
      this.productEditGroup.get('total_price').setValue(ProductEditDialogComponent.roundTo2Decimals(this.calcTotalPrice()));
    } else {
      this.productEditGroup.get('price').setValue(ProductEditDialogComponent.roundTo2Decimals(this.calcSinglePrice()));
    }
  }

  private singlePriceInsertChanged(): void {
    this.priceSubscription.unsubscribe();
    if (this.productEditGroup.get('single_price_insert').value) {
      this.singlePrice = true;
      this.priceSubscription.add(this.productEditGroup.get('price').valueChanges.subscribe(() => {
        this.recalculateTotalPrice();
      }));
    } else {
      this.singlePrice = false;
      this.priceSubscription.add(this.productEditGroup.get('total_price').valueChanges.subscribe(() => {
        this.recalculateTotalPrice();
      }));
    }
  }
}

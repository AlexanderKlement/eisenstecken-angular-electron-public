import { Component, DEFAULT_CURRENCY_CODE, Inject, LOCALE_ID, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { DefaultService, Unit } from "../../../../api/openapi";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatButton } from "@angular/material/button";

export interface OrderDialogData {
  title: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  amount: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  unit_id?: number;
  price: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  mod_number: string;
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
  styleUrls: ['./product-edit-dialog.component.scss'],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlexModule,
    MatSelect,
    MatOption,
    DefaultFlexDirective,
    MatButton,
    AsyncPipe,
  ],
})
export class ProductEditDialogComponent implements OnInit, OnDestroy {
  unitOptions$: Observable<Unit[]>;
  productEditGroup: UntypedFormGroup;
  subscription: Subscription;
  createMode: boolean;
  blockRequestChange = false;

  constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData,
    @Inject(DEFAULT_CURRENCY_CODE) private readonly currencyCode: string,
    @Inject(LOCALE_ID) private readonly locale: string,
    private api: DefaultService,
    private currency: CurrencyPipe,
  ) {
  }

  public static roundTo2Decimals(input: number): number {
    return Math.round(input * 100) / 100;
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.unitOptions$ = this.api.readUnitsUnitGet();
    this.blockRequestChange = this.data.blockRequestChange;
    this.initProductEditGroup();
    this.createMode = this.data.create;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    const price = parseFloat(
      this.productEditGroup
        .get("priceFormatted")
        .value.replace("€", "")
        .replace(".", "")
        .replace(",", "."),
    );
    const formattedAmount = this.currency.transform(
      price,
      this.currencyCode, "symbol", undefined, this.locale,
    );
    this.productEditGroup.get("price").setValue(price);
    this.productEditGroup.get("priceFormatted").setValue(formattedAmount);
  }

  private getReturnData(deleteOrder: boolean): OrderDialogData {
    return {
      title: this.productEditGroup.get("title").value,
      name: this.productEditGroup.get("name").value,
      amount: this.productEditGroup.get("amount").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: this.productEditGroup.get("unit_id").value,
      price: this.productEditGroup.get("price").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: this.productEditGroup.get("mod_number").value,
      request: this.productEditGroup.get("request").value,
      comment: this.productEditGroup.get("comment").value,
      position: this.productEditGroup.get("position").value,
      delete: deleteOrder,
      create: this.data.create,
      blockRequestChange: this.blockRequestChange,
    };
  }

  private initProductEditGroup(): void {
    console.log(this.data.unit_id);
    this.productEditGroup = new UntypedFormGroup({
      title: new UntypedFormControl(this.data.title),
      name: new UntypedFormControl(this.data.name, Validators.required),
      amount: new UntypedFormControl(
        this.data.amount,
        Validators.min(0.0000001),
      ),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: new UntypedFormControl(
        this.data.unit_id !== null ? this.data.unit_id : 3,
      ),
      price: new UntypedFormControl(this.data.price, Validators.min(0)),
      priceFormatted: new UntypedFormControl(
        this.currency.transform(
          this.data.price,
          this.currencyCode, "symbol", undefined, this.locale,
        ),
      ),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: new UntypedFormControl(this.data.mod_number),
      request: new UntypedFormControl(this.data.request),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      total_price: new UntypedFormControl(0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price_insert: new UntypedFormControl(true),
      comment: new UntypedFormControl(this.data.comment),
      position: new UntypedFormControl(this.data.position),
    });
    this.subscription.add(
      this.productEditGroup.get("price").valueChanges.subscribe(() => {
        this.updateTotalFromPrice();
      }),
    );
    this.subscription.add(
      this.productEditGroup.get("amount").valueChanges.subscribe(() => {
        this.updateTotalFromPrice();
      }),
    );
    this.subscription.add(
      this.productEditGroup.get("total_price").valueChanges.subscribe(() => {
        this.updatePriceFromTotal();
      }),
    );
    this.updateTotalFromPrice();
  }

  private calcTotalPrice(): number {
    return this.productEditGroup.get("price").value *
      this.productEditGroup.get("amount").value;
  }

  private updateTotalFromPrice(): void {
    const total = ProductEditDialogComponent.roundTo2Decimals(
      this.calcTotalPrice(),
    );
    this.productEditGroup
      .get("total_price")
      .setValue(total, { emitEvent: false });
  }

  private updatePriceFromTotal(): void {
    const amount = this.productEditGroup.get("amount").value || 1;
    const total = this.productEditGroup.get("total_price").value || 0;

    const price = amount
      ? ProductEditDialogComponent.roundTo2Decimals(total / amount)
      : 0;

    this.productEditGroup.get("price").setValue(price, { emitEvent: false });

    const formatted = this.currency.transform(
      price,
      this.currencyCode, "symbol", undefined, this.locale,
    );
    this.productEditGroup
      .get("priceFormatted")
      .setValue(formatted, { emitEvent: false });
  }
}

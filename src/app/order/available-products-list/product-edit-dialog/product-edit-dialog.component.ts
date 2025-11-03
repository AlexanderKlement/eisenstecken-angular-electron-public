import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { CurrencyPipe, getLocaleCurrencyCode } from "@angular/common";
import { DefaultService, Unit } from "../../../../api/openapi";
import { BaseDialogComponent } from "../../../shared/components/base-dialog/base-dialog.component";

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
  selector: "app-product-edit-dialog",
  templateUrl: "./product-edit-dialog.component.html",
  styleUrls: ["./product-edit-dialog.component.scss"],
  standalone: false,
})
export class ProductEditDialogComponent
  extends BaseDialogComponent
  implements OnInit, OnDestroy
{
  unitOptions$: Observable<Unit[]>;
  productEditGroup: UntypedFormGroup;
  subscription: Subscription;
  createMode: boolean;
  blockRequestChange = false;

  constructor(
    public dialogRef: MatDialogRef<ProductEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData,
    private api: DefaultService,
    private currency: CurrencyPipe,
  ) {
    super();
  }

  public static roundTo2Decimals(input: number): number {
    // TODO: move bitch get out the way
    // -> i guess i was trying to say: move this to a utils class
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
      getLocaleCurrencyCode("de_DE"),
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
          getLocaleCurrencyCode("de_DE"),
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
    const price =
      this.productEditGroup.get("price").value *
      this.productEditGroup.get("amount").value;
    return price;
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
      getLocaleCurrencyCode("de-DE"),
    );
    this.productEditGroup
      .get("priceFormatted")
      .setValue(formatted, { emitEvent: false });
  }
}

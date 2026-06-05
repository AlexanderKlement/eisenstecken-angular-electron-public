import { Component, DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { AsyncPipe, CurrencyPipe } from "@angular/common";
import { DefaultService, Unit } from "../../../../api/openapi";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatButton } from "@angular/material/button";

export type OrderDialogMode = "delete" | "save" | "add";

export interface OrderDialogBaseData {
  name: string;
  amount: number;
  unitId: number;
  price: number;
  modNumber: string;
  request: boolean;
  comment: string;
  position: string;
  favorite: boolean;
}

type OrderFormGroup = {
  name: FormControl<string>
  amount: FormControl<number>
  unit_id: FormControl<number>
  price: FormControl<number>
  priceFormatted: FormControl<string>
  mod_number: FormControl<string>
  request: FormControl<boolean>
  total_price: FormControl<number>
  comment: FormControl<string>
  position: FormControl<string>
  favorite: FormControl<boolean>
}

export interface OrderDialogReturnData extends OrderDialogBaseData {
  mode: OrderDialogMode;
}

export interface OrderDialogCreateData extends OrderDialogBaseData {
  title: string;
  blockRequestChange: boolean;
  blockFavoriteChange: boolean;
  createMode: boolean;
}

@Component({
  selector: "app-product-edit-dialog",
  templateUrl: "./product-edit-dialog.component.html",
  styleUrls: ["./product-edit-dialog.component.scss"],
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
    AsyncPipe
  ]
})
export class ProductEditDialogComponent implements OnInit, OnDestroy {
  dialogRef = inject<MatDialogRef<ProductEditDialogComponent>>(MatDialogRef);
  data = inject<OrderDialogCreateData>(MAT_DIALOG_DATA);
  private readonly currencyCode = inject(DEFAULT_CURRENCY_CODE);
  private readonly locale = inject(LOCALE_ID);
  private api = inject(DefaultService);
  private currency = inject(CurrencyPipe);

  unitOptions$: Observable<Unit[]>;
  productEditGroup: FormGroup<OrderFormGroup>;
  subscription: Subscription;
  createMode: boolean;
  blockRequestChange = false;

  public static roundTo2Decimals(input: number): number {
    return Math.round(input * 100) / 100;
  }

  public static roundTo4Decimals(input: number): number {
    return Math.round(input * 10000) / 10000;
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.unitOptions$ = this.api.readUnitsUnitGet();
    this.blockRequestChange = this.data.blockRequestChange;
    this.initProductEditGroup();
    this.createMode = this.data.createMode;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close(this.getReturnData("save"));
  }

  onAddClick(): void {
    this.dialogRef.close(this.getReturnData("add"));
  }

  onDeleteClick(): void {
    this.dialogRef.close(this.getReturnData("delete"));
  }

  transformAmount(): void {
    const price = parseFloat(
      this.productEditGroup
        .get("priceFormatted")
        .value.replace("€", "")
        .replace(".", "")
        .replace(",", ".")
    );
    const formattedAmount = this.currency.transform(
      price,
      this.currencyCode, "symbol", "1.4-4", this.locale
    );
    this.productEditGroup.get("price").setValue(price);
    this.productEditGroup.get("priceFormatted").setValue(formattedAmount);
  }

  private getReturnData(mode: OrderDialogMode): OrderDialogReturnData {
    if (!this.data.createMode && mode == "add") {
      console.error("Cannot add a product to an existing product");
    }

    return {
      name: this.productEditGroup.get("name").value,
      amount: this.productEditGroup.get("amount").value,
      unitId: this.productEditGroup.get("unit_id").value,
      price: this.productEditGroup.get("price").value,
      modNumber: this.productEditGroup.get("mod_number").value,
      request: this.productEditGroup.get("request").value,
      comment: this.productEditGroup.get("comment").value,
      position: this.productEditGroup.get("position").value,
      favorite: this.productEditGroup.get("favorite").value,
      mode
    };
  }

  private initProductEditGroup(): void {
    console.log(this.data.unitId);
    this.productEditGroup = new FormGroup<OrderFormGroup>({
      name: new FormControl(this.data.name, Validators.required),
      amount: new FormControl(
        this.data.amount,
        Validators.min(0.0000001)
      ),
      unit_id: new FormControl(
        this.data.unitId !== null ? this.data.unitId : 3
      ),
      price: new FormControl(this.data.price, Validators.min(0)),
      priceFormatted: new FormControl(
        this.currency.transform(
          this.data.price,
          this.currencyCode, "symbol", "1.4-4", this.locale
        )
      ),
      mod_number: new FormControl(this.data.modNumber),
      request: new FormControl(this.data.request),
      total_price: new FormControl(0),
      comment: new FormControl(this.data.comment),
      position: new FormControl(this.data.position),
      favorite: new FormControl(this.data.favorite)
    });
    if (this.data.blockFavoriteChange) {
      this.productEditGroup.get("favorite")?.disable({ emitEvent: false });
    }
    this.subscription.add(
      this.productEditGroup.get("price").valueChanges.subscribe(() => {
        this.updateTotalFromPrice();
      })
    );
    this.subscription.add(
      this.productEditGroup.get("amount").valueChanges.subscribe(() => {
        this.updateTotalFromPrice();
      })
    );
    this.subscription.add(
      this.productEditGroup.get("total_price").valueChanges.subscribe(() => {
        this.updatePriceFromTotal();
      })
    );
    this.updateTotalFromPrice();
  }

  private calcTotalPrice(): number {
    return this.productEditGroup.get("price").value *
      this.productEditGroup.get("amount").value;
  }

  private updateTotalFromPrice(): void {
    const total = ProductEditDialogComponent.roundTo2Decimals(
      this.calcTotalPrice()
    );
    this.productEditGroup
      .get("total_price")
      .setValue(total, { emitEvent: false });
  }

  private updatePriceFromTotal(): void {
    const amount = this.productEditGroup.get("amount").value || 1;
    const total = this.productEditGroup.get("total_price").value || 0;

    const price = amount
      ? ProductEditDialogComponent.roundTo4Decimals(total / amount)
      : 0;

    this.productEditGroup.get("price").setValue(price, { emitEvent: false });

    const formatted = this.currency.transform(
      price,
      this.currencyCode, "symbol", "1.4-4", this.locale
    );
    this.productEditGroup
      .get("priceFormatted")
      .setValue(formatted, { emitEvent: false });
  }
}

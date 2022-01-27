import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {DefaultService, Unit, Vat} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup, Validators} from '@angular/forms';

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

    constructor(public dialogRef: MatDialogRef<ProductEditDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: OrderDialogData, private api: DefaultService) {
    }

    ngOnInit(): void {
        this.subscription = new Subscription();
        this.priceSubscription = new Subscription();
        this.vatOptions$ = this.api.readVatsVatGet();
        this.unitOptions$ = this.api.readUnitsUnitGet();
        this.initProductEditGroup();
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
            price: this.productEditGroup.get('price').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mod_number: this.productEditGroup.get('mod_number').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            vat_id: this.productEditGroup.get('vat_id').value,
            request: this.productEditGroup.get('request').value,
            comment: this.productEditGroup.get('comment').value,
            position: this.productEditGroup.get('position').value,
            delete: deleteOrder,
        };
    }

    private initProductEditGroup(): void {
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


    private recalculateTotalPrice(): void {
        if (this.singlePrice) {
            let price = this.productEditGroup.get('price').value * this.productEditGroup.get('amount').value;
            price = price * (1 - (this.productEditGroup.get('discount').value / 100));
            this.productEditGroup.get('total_price').setValue(price);
        } else {
            let price = this.productEditGroup.get('total_price').value / (1 - (this.productEditGroup.get('discount').value / 100));
            price = price / this.productEditGroup.get('amount').value;
            this.productEditGroup.get('price').setValue(price);
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

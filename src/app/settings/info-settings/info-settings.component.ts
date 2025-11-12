import {Component, OnInit} from "@angular/core";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {first} from "rxjs/operators";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ThemePalette} from "@angular/material/core";
import {DefaultService, TechnicalData, TechnicalDataUpdate, PriceUpdate, Price, CredentialUpdate, Credential} from "../../../api/openapi";
import { MatTabGroup, MatTab } from "@angular/material/tabs";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatFabButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-info-settings',
    templateUrl: './info-settings.component.html',
    styleUrls: ['./info-settings.component.scss'],
    imports: [MatTabGroup, MatTab, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatFabButton, MatIcon, MatButton]
})
export class InfoSettingsComponent implements OnInit {

    credentialGroup: UntypedFormGroup;
    priceGroup: UntypedFormGroup;
    technicalDataGroup: UntypedFormGroup;
    submitted = false;


    constructor(private api: DefaultService, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        this.initCredentials();
        this.initPrices();
        this.initTechnicalData();

    }


    clearFormArray(formArray: UntypedFormArray): void {
        while (formArray.length > 0) {
            formArray.removeAt(0);
        }
    }


    initCredentials(): void {
        this.credentialGroup = new UntypedFormGroup({
            credentials: new UntypedFormArray([]),
        });
        this.api.readCredentialsCredentialGet(0, 1000).pipe(first()).subscribe((credentials) => {
            this.addCredentialArrayToFormGroup(credentials);
        });
    }

    addCredentialArrayToFormGroup(credentials: Credential[]): void {
        for (const credential of credentials) {
            this.getCredentialFormArray().push(this.createCredential(credential));
        }
    }

    createCredential(credential?: Credential): UntypedFormGroup {
        if (credential === undefined) {
            return new UntypedFormGroup({
                name: new UntypedFormControl(""),
                url: new UntypedFormControl(""),
                username: new UntypedFormControl(""),
                password: new UntypedFormControl(""),
            });
        } else {
            return new UntypedFormGroup({
                name: new UntypedFormControl(credential.name),
                url: new UntypedFormControl(credential.url),
                username: new UntypedFormControl(credential.username),
                password: new UntypedFormControl(credential.password),
            });
        }
    }

    getCredentialFormArray(): UntypedFormArray {
        return this.credentialGroup.get("credentials") as UntypedFormArray;
    }

    updateCredentialsSuccess(credentials: Credential[]): void {
        this.clearFormArray(this.getCredentialFormArray());
        this.addCredentialArrayToFormGroup(credentials);
        this.submitted = false;
        this.showSuccess();
    }

    removeCredentialAt(index: number): void {
        this.getCredentialFormArray().removeAt(index);
    }

    addNewCredential(): void {
        this.getCredentialFormArray().push(this.createCredential());
    }


    onSubmitCredentials() {
        this.submitted = true;
        const credentialUpdates: CredentialUpdate[] = [];
        this.getCredentialFormArray().controls.forEach((credential) => {
            credentialUpdates.push({
                name: credential.get("name").value,
                url: credential.get("url").value,
                username: credential.get("username").value,
                password: credential.get("password").value,
            });
        });
        this.api.bulkUpdateCredentialsCredentialBulkPut(credentialUpdates).pipe(first()).subscribe({
            next: this.updateCredentialsSuccess.bind(this),
            error: this.updateError.bind(this),
            complete: this.updateComplete.bind(this)
        });
    }

    initPrices(): void {
        this.priceGroup = new UntypedFormGroup({
            prices: new UntypedFormArray([]),
        });
        this.api.readPricesPriceGet(0, 1000).pipe(first()).subscribe((prices) => {
            this.addPriceArrayToFormGroup(prices);
        });
    }

    addPriceArrayToFormGroup(prices: Price[]): void {
        for (const price of prices) {
            this.getPriceFormArray().push(this.createPrice(price));
        }
    }

    createPrice(price?: Price): UntypedFormGroup {
        if (price === undefined) {
            return new UntypedFormGroup({
                name: new UntypedFormControl(""),
                price: new UntypedFormControl(""),
                comment: new UntypedFormControl(""),
            });
        } else {
            return new UntypedFormGroup({
                name: new UntypedFormControl(price.name),
                price: new UntypedFormControl(price.price),
                comment: new UntypedFormControl(price.comment),
            });
        }
    }

    getPriceFormArray(): UntypedFormArray {
        return this.priceGroup.get("prices") as UntypedFormArray;
    }

    updatePricesSuccess(prices: Price[]): void {
        this.clearFormArray(this.getPriceFormArray());
        this.addPriceArrayToFormGroup(prices);
        this.submitted = false;
        this.showSuccess();
    }

    removePriceAt(index: number): void {
        this.getPriceFormArray().removeAt(index);
    }

    addNewPrice(): void {
        this.getPriceFormArray().push(this.createPrice());
    }


    onSubmitPrices() {
        this.submitted = true;
        const priceUpdates: PriceUpdate[] = [];
        this.getPriceFormArray().controls.forEach((price) => {
            priceUpdates.push({
                name: price.get("name").value,
                price: price.get("price").value,
                comment: price.get("comment").value,
            });
        });
        this.api.bulkUpdatePricesPriceBulkPut(priceUpdates).pipe(first()).subscribe({
            next: this.updatePricesSuccess.bind(this),
            error: this.updateError.bind(this),
            complete: this.updateComplete.bind(this)
        });
    }

    initTechnicalData(): void {
        this.technicalDataGroup = new UntypedFormGroup({
            technicalData: new UntypedFormArray([]),
        });
        this.api.readTechnicalDatasTechnicalDataGet(0, 1000).pipe(first()).subscribe((technicalData) => {
            this.addTechnicalDataArrayToFormGroup(technicalData);
        });
    }

    addTechnicalDataArrayToFormGroup(technicalData: TechnicalData[]): void {
        for (const singleTechnicalData of technicalData) {
            this.getTechnicalDataFormArray().push(this.createTechnicalData(singleTechnicalData));
        }
    }

    createTechnicalData(technicalData?: TechnicalData): UntypedFormGroup {
        if (technicalData === undefined) {
            return new UntypedFormGroup({
                name: new UntypedFormControl(""),
                height: new UntypedFormControl(""),
                width: new UntypedFormControl(""),
                length: new UntypedFormControl(""),
            });
        } else {
            return new UntypedFormGroup({
                name: new UntypedFormControl(technicalData.name),
                height: new UntypedFormControl(technicalData.height),
                width: new UntypedFormControl(technicalData.width),
                length: new UntypedFormControl(technicalData.length),
            });
        }
    }

    getTechnicalDataFormArray(): UntypedFormArray {
        return this.technicalDataGroup.get("technicalData") as UntypedFormArray;
    }

    updateTechnicalDataSuccess(technicalData: TechnicalData[]): void {
        this.clearFormArray(this.getTechnicalDataFormArray());
        this.addTechnicalDataArrayToFormGroup(technicalData);
        this.submitted = false;
        this.showSuccess();
    }

    removeTechnicalDataAt(index: number): void {
        this.getTechnicalDataFormArray().removeAt(index);
    }

    addNewTechnicalData(): void {
        this.getTechnicalDataFormArray().push(this.createTechnicalData());
    }


    onSubmitTechnicalData() {
        this.submitted = true;
        const technicalDataUpdates: TechnicalDataUpdate[] = [];
        this.getTechnicalDataFormArray().controls.forEach((technicalData) => {
            technicalDataUpdates.push({
                name: technicalData.get("name").value,
                height: technicalData.get("height").value,
                width: technicalData.get("width").value,
                length: technicalData.get("length").value,
            });
        });
        this.api.bulkUpdateTechnicalDataTechnicalDataBulkPut(technicalDataUpdates).pipe(first()).subscribe({
            next: this.updateTechnicalDataSuccess.bind(this),
            error: this.updateError.bind(this),
            complete: this.updateComplete.bind(this)
        });
    }

    moveDescriptiveArticleUp(formArray: UntypedFormArray, index: number) {
        const descriptiveArticle = formArray.at(index);
        formArray.removeAt(index);
        formArray.insert(index - 1, descriptiveArticle);
    }

    moveDescriptiveArticleDown(formArray: UntypedFormArray, index: number) {
        const descriptiveArticle = formArray.at(index);
        formArray.removeAt(index);
        formArray.insert(index + 1, descriptiveArticle);
    }

    movePriceUpClicked(i: number) {
        this.moveDescriptiveArticleUp(this.getPriceFormArray(), i);
    }

    movePriceDownClicked(i: number) {
        this.moveDescriptiveArticleDown(this.getPriceFormArray(), i);
    }

    moveCredentialDownClicked(i: number) {
        this.moveDescriptiveArticleDown(this.getCredentialFormArray(), i);
    }

    moveCredentialUpClicked(i: number) {
        this.moveDescriptiveArticleUp(this.getCredentialFormArray(), i);
    }

    moveTechnicalDataUpClicked(i: number) {
        this.moveDescriptiveArticleUp(this.getTechnicalDataFormArray(), i);
    }

    moveTechnicalDataDownClicked(i: number) {
        this.moveDescriptiveArticleDown(this.getTechnicalDataFormArray(), i);
    }

    private updateError(error: any): void {
        console.error("InfoSettingsComponent: Could not update");
        console.error(error);
        this.submitted = false;
    }

    private updateComplete(): void {
        this.submitted = false;
    }

    private showSuccess(): void {
        this.snackBar.open("Speichern erfolgreich!", "OK", {
            duration: 5000
        });
    }

}

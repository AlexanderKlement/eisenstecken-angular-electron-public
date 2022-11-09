import {Component, OnDestroy, OnInit} from '@angular/core';
import {BaseEditComponent} from '../../shared/components/base-edit/base-edit.component';
import {
    Contact, ContactCreate,
    DefaultService,
    Language,
    Lock,
    Supplier, SupplierCreate
} from 'eisenstecken-openapi-angular-library';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NavigationService} from '../../shared/services/navigation.service';

@Component({
    selector: 'app-supplier-edit',
    templateUrl: './supplier-edit.component.html',
    styleUrls: ['./supplier-edit.component.scss']
})
export class SupplierEditComponent extends BaseEditComponent<Supplier> implements OnInit, OnDestroy {

    supplierGroup: FormGroup;

    navigationTarget = 'supplier';
    languageOptions$: Observable<Language[]>;
    title = 'Lieferant: Bearbeiten';
    showInOrders = true;

    constructor(api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog, private navigation: NavigationService) {
        super(api, router, route, dialog);
    }

    lockFunction = (api: DefaultService, id: number): Observable<Lock> => api.islockedSupplierSupplierIslockedSupplierIdGet(id);
    dataFunction = (api: DefaultService, id: number): Observable<Supplier> => api.readSupplierSupplierSupplierIdGet(id);
    unlockFunction = (api: DefaultService, id: number): Observable<boolean> => api.unlockSupplierSupplierUnlockSupplierIdPost(id);

    ngOnInit(): void {
        super.ngOnInit();
        this.initSupplierGroup();
        this.languageOptions$ = this.api.readLanguagesLanguageGet();

        if (this.createMode) {
            this.title = 'Lieferant: Erstellen';
        }
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    onSubmit(): void {
        this.submitted = true;

        const contacts: ContactCreate[] = [];

        for (const contactGroup of this.getContacts().controls) {
            if (contactGroup.get('tel').value.trim().length <= 3 && contactGroup.get('mail').value.trim().length === 0) {
                continue;
            }
            contacts.push({
                id: parseInt(contactGroup.get('id').value, 10),
                name: contactGroup.get('name').value,
                name1: contactGroup.get('name1').value,
                lastname: contactGroup.get('lastname').value,
                tel: contactGroup.get('tel').value,
                mail: contactGroup.get('mail').value,
                note: contactGroup.get('note').value,
            });
        }


        const supplierCreate: SupplierCreate = {
            contacts,
            name: this.supplierGroup.get('name').value,
            mail1: this.supplierGroup.get('mail1').value,
            mail2: this.supplierGroup.get('mail2').value,
            tel1: this.supplierGroup.get('tel1').value,
            tel2: this.supplierGroup.get('tel2').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            contact_person: this.supplierGroup.get('contact_person').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            destination_code: this.supplierGroup.get('destination_code').value,
            address: {
                name: this.supplierGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                street_number: this.supplierGroup.get('address.street_number').value,
                city: this.supplierGroup.get('address.city').value,
                cap: this.supplierGroup.get('address.cap').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                country_code: this.supplierGroup.get('address.country').value,
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
            language_code: this.supplierGroup.get('language').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            show_in_orders: this.showInOrders,
        };

        if (this.createMode) {
            this.api.createSupplierSupplierPost(supplierCreate).subscribe((supplier) => {
                this.createUpdateSuccess(supplier);
            }, (error) => {
                this.createUpdateError(error);
            }, () => {
                this.createUpdateComplete();
            });
        } else {
            this.api.updateSupplierSupplierSupplierIdPut(this.id, supplierCreate).subscribe((supplier) => {
                this.createUpdateSuccess(supplier);
            }, (error) => {
                this.createUpdateError(error);
            }, () => {
                this.createUpdateComplete();
            });
        }
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 43;
    }

    createUpdateSuccess(supplier: Supplier): void {
        this.id = supplier.id;
        if (this.createMode) {
            this.navigation.removeLastUrl();
            this.router.navigateByUrl('supplier', {replaceUrl: true});
        } else {
            this.navigation.removeLastUrl();
            this.router.navigateByUrl('supplier/' + supplier.id.toString(), {replaceUrl: true});
        }

    }

    getAddressGroup(): FormGroup {
        return this.supplierGroup.get('address') as FormGroup;
    }

    observableReady(): void {
        super.observableReady();
        if (!this.createMode) {
            this.data$.pipe(tap(client => this.supplierGroup.patchValue(client))).subscribe((client) => {
                    this.supplierGroup.patchValue({
                        language: client.language.code,
                        name: client.name,
                        address: {
                            country: client.address.country.code
                        }
                    });
                    this.showInOrders = client.show_in_orders;
                    for (const contact of client.contacts) {
                        this.addContact(contact);
                    }
                }
            );
        }
    }

    getContacts(): FormArray {
        return this.supplierGroup.get('contacts') as FormArray;
    }

    addContact(contact?: Contact): void {
        this.getContacts().push(this.createContact(contact));
    }

    createContact(contact?: Contact): FormGroup {
        if (contact !== undefined) {
            return new FormGroup({
                id: new FormControl(contact.id),
                name: new FormControl(contact.name),
                name1: new FormControl(contact.name1),
                lastname: new FormControl(contact.lastname),
                tel: new FormControl(contact.tel),
                mail: new FormControl(contact.mail),
                note: new FormControl(contact.note)
            });
        } else {
            return new FormGroup({
                id: new FormControl(-1),
                name: new FormControl(''),
                name1: new FormControl(this.supplierGroup.get('name').value),
                lastname: new FormControl(''),
                tel: new FormControl('+39'),
                mail: new FormControl(''),
                note: new FormControl('')
            });
        }
    }

    removeContactAt(index: number): void {
        this.getContacts().removeAt(index);
    }

    showInOrdersCheckBoxClicked() {
        this.showInOrders = !this.showInOrders;
    }

    private initSupplierGroup() {
        this.supplierGroup = new FormGroup({
            name: new FormControl(''),
            mail1: new FormControl(''),
            mail2: new FormControl(''),
            tel1: new FormControl(''),
            tel2: new FormControl(''),
            language: new FormControl('DE'),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            contact_person: new FormControl(''),
            contacts: new FormArray([]),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            destination_code: new FormControl(''),
            address: new FormGroup({
                // eslint-disable-next-line @typescript-eslint/naming-convention
                street_number: new FormControl(''),
                city: new FormControl(''),
                cap: new FormControl(''),
                country: new FormControl('IT')
            }),
        });
        this.supplierGroup.get('name').valueChanges.subscribe(() => {
            for (const contact of this.getContacts().controls) {
                contact.get('name1').setValue(this.supplierGroup.get('name').value);
            }
        });
    }
}

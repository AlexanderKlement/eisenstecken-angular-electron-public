import { Component, OnDestroy, OnInit } from "@angular/core";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import {
  Contact,
  ContactCreate,
  DefaultService,
  Language,
  Lock,
  Supplier,
  SupplierCreate,
} from "../../../api/openapi";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatCheckbox } from "@angular/material/checkbox";
import { AddressFormComponent } from "../../shared/components/address-form/address-form.component";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: 'app-supplier-edit',
    templateUrl: './supplier-edit.component.html',
    styleUrls: ['./supplier-edit.component.scss'],
    imports: [
        ToolbarComponent,
        FormsModule,
        ReactiveFormsModule,
        DefaultLayoutDirective,
        DefaultLayoutAlignDirective,
        MatFormField,
        MatLabel,
        MatInput,
        MatIconButton,
        MatButton,
        MatIcon,
        MatSelect,
        MatOption,
        MatCheckbox,
        AddressFormComponent,
        FlexModule,
        AsyncPipe,
    ],
})
export class SupplierEditComponent
  extends BaseEditComponent<Supplier>
  implements OnInit, OnDestroy {
  supplierGroup: UntypedFormGroup;

  navigationTarget = "supplier";
  languageOptions$: Observable<Language[]>;
  title = "Lieferant: Bearbeiten";
  showInOrders = true;

  constructor(api: DefaultService, router: Router, route: ActivatedRoute) {
    super(api, router, route);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedSupplierSupplierIslockedSupplierIdGet(id);
  dataFunction = (api: DefaultService, id: number): Observable<Supplier> =>
    api.readSupplierSupplierSupplierIdGet(id);
  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.unlockSupplierSupplierUnlockSupplierIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.initSupplierGroup();
    this.languageOptions$ = this.api.readLanguagesLanguageGet();

    if (this.createMode) {
      this.title = "Lieferant: Erstellen";
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSubmit(): void {
    this.submitted = true;

    const contacts: ContactCreate[] = [];

    for (const contactGroup of this.getContacts().controls) {
      if (
        contactGroup.get("tel").value.trim().length <= 3 &&
        contactGroup.get("mail").value.trim().length === 0
      ) {
        continue;
      }
      contacts.push({
        id: parseInt(contactGroup.get("id").value, 10),
        name: contactGroup.get("name").value,
        name1: contactGroup.get("name1").value,
        lastname: contactGroup.get("lastname").value,
        tel: contactGroup.get("tel").value,
        mail: contactGroup.get("mail").value,
        note: contactGroup.get("note").value,
      });
    }

    const supplierCreate: SupplierCreate = {
      contacts,
      name: this.supplierGroup.get("name").value,
      mail1: this.supplierGroup.get("mail1").value,
      mail2: this.supplierGroup.get("mail2").value,
      tel1: this.supplierGroup.get("tel1").value,
      tel2: this.supplierGroup.get("tel2").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      contact_person: this.supplierGroup.get("contact_person").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      send_order_to: this.supplierGroup.get("send_order_to").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      destination_code: this.supplierGroup.get("destination_code").value,
      address: {
        name: this.supplierGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: this.supplierGroup.get("address.street_number").value,
        city: this.supplierGroup.get("address.city").value,
        cap: this.supplierGroup.get("address.cap").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country_code: this.supplierGroup.get("address.country").value,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      language_code: this.supplierGroup.get("language").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      show_in_orders: this.showInOrders,
    };

    if (this.createMode) {
      this.api.createSupplierSupplierPost(supplierCreate).subscribe(
        (supplier) => {
          this.createUpdateSuccess(supplier);
        },
        (error) => {
          this.createUpdateError(error);
        },
        () => {
          this.createUpdateComplete();
        },
      );
    } else {
      this.api
        .updateSupplierSupplierSupplierIdPut(this.id, supplierCreate)
        .subscribe(
          (supplier) => {
            this.createUpdateSuccess(supplier);
          },
          (error) => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          },
        );
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return (
      !(charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 43
    );
  }

  createUpdateSuccess(supplier: Supplier): void {
    this.id = supplier.id;
    if (this.createMode) {
      this.router.navigateByUrl("supplier/", { replaceUrl: true });
    } else {
      this.router.navigateByUrl("supplier/" + supplier.id.toString(), { replaceUrl: true });
    }
  }

  getAddressGroup(): UntypedFormGroup {
    return this.supplierGroup.get("address") as UntypedFormGroup;
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$
        .pipe(tap((client) => this.supplierGroup.patchValue(client)))
        .subscribe((client) => {
          this.supplierGroup.patchValue({
            language: client.language.code,
            name: client.name,
            address: {
              country: client.address.country.code,
            },
          });
          this.showInOrders = client.show_in_orders;
          for (const contact of client.contacts) {
            this.addContact(contact);
          }
        });
    }
  }

  getContacts(): UntypedFormArray {
    return this.supplierGroup.get("contacts") as UntypedFormArray;
  }

  addContact(contact?: Contact): void {
    this.getContacts().push(this.createContact(contact));
  }

  createContact(contact?: Contact): UntypedFormGroup {
    if (contact !== undefined) {
      return new UntypedFormGroup({
        id: new UntypedFormControl(contact.id),
        name: new UntypedFormControl(contact.name),
        name1: new UntypedFormControl(contact.name1),
        lastname: new UntypedFormControl(contact.lastname),
        tel: new UntypedFormControl(contact.tel),
        mail: new UntypedFormControl(contact.mail),
        note: new UntypedFormControl(contact.note),
      });
    } else {
      return new UntypedFormGroup({
        id: new UntypedFormControl(-1),
        name: new UntypedFormControl(""),
        name1: new UntypedFormControl(this.supplierGroup.get("name").value),
        lastname: new UntypedFormControl(""),
        tel: new UntypedFormControl("+39"),
        mail: new UntypedFormControl(""),
        note: new UntypedFormControl(""),
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
    this.supplierGroup = new UntypedFormGroup({
      name: new UntypedFormControl(""),
      mail1: new UntypedFormControl(""),
      mail2: new UntypedFormControl(""),
      tel1: new UntypedFormControl(""),
      tel2: new UntypedFormControl(""),
      language: new UntypedFormControl("DE"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      contact_person: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      send_order_to: new UntypedFormControl(""),
      contacts: new UntypedFormArray([]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      destination_code: new UntypedFormControl(""),
      address: new UntypedFormGroup({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: new UntypedFormControl(""),
        city: new UntypedFormControl(""),
        cap: new UntypedFormControl(""),
        country: new UntypedFormControl("IT"),
      }),
    });
    this.supplierGroup.get("name").valueChanges.subscribe(() => {
      for (const contact of this.getContacts().controls) {
        contact.get("name1").setValue(this.supplierGroup.get("name").value);
      }
    });
  }
}

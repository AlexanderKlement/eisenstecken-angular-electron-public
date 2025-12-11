import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { tap } from "rxjs/operators";
import {
  Contact,
  Gender,
  Language,
  Client,
  DefaultService,
  Lock,
  ContactCreate,
  ClientCreate,
} from "../../../api/openapi";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  FlexModule,
} from "ng-flex-layout";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatSelect, MatOption } from "@angular/material/select";
import { AddressFormComponent } from "../../shared/components/address-form/address-form.component";
import { AsyncPipe } from "@angular/common";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-client-edit",
  templateUrl: "./client-edit.component.html",
  styleUrls: ["./client-edit.component.scss"],
  imports: [
    ToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatCheckbox,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    AddressFormComponent,
    FlexModule,
    AsyncPipe,
    CircleIconButtonComponent,
  ],
})
export class ClientEditComponent
  extends BaseEditComponent<Client>
  implements OnInit, OnDestroy
{
  title = "Kunde: Bearbeiten";
  navigationTarget = "/client";
  clientGroup: UntypedFormGroup;
  company = false;
  genderOptions$: Observable<Gender[]>;
  languageOptions$: Observable<Language[]>;

  constructor(api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog) {
    super(api, router, route, dialog);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedClientClientIslockedClientIdGet(id);
  dataFunction = (api: DefaultService, id: number): Observable<Client> =>
    api.readClientClientClientIdGet(id);
  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.unlockClientClientUnlockClientIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.clientGroup = new UntypedFormGroup({
      name: new UntypedFormControl(""),
      lastname: new UntypedFormControl(""),
      isCompany: new UntypedFormControl(""),
      mail1: new UntypedFormControl(""),
      mail2: new UntypedFormControl(""),
      tel1: new UntypedFormControl("+39"),
      tel2: new UntypedFormControl("+39"),
      contacts: new UntypedFormArray([]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      contact_person: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_number: new UntypedFormControl("IT"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fiscal_code: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      codice_destinatario: new UntypedFormControl("0000000"),
      pec: new UntypedFormControl(""),
      gender: new UntypedFormControl("M"),
      language: new UntypedFormControl("DE"),
      address: new UntypedFormGroup({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: new UntypedFormControl(""),
        city: new UntypedFormControl(""),
        cap: new UntypedFormControl(""),
        country: new UntypedFormControl("IT"),
      }),
    });
    this.genderOptions$ = this.api.readGendersGenderGet();
    this.languageOptions$ = this.api.readLanguagesLanguageGet();
    if (this.createMode) {
      this.title = "Kunde: Erstellen";
    }

    this.clientGroup.get("name").valueChanges.subscribe(() => {
      for (const contact of this.getContacts().controls) {
        contact.get("name").setValue(this.clientGroup.get("name").value);
      }
    });

    this.clientGroup.get("lastname").valueChanges.subscribe(() => {
      for (const contact of this.getContacts().controls) {
        contact
          .get("lastname")
          .setValue(this.clientGroup.get("lastname").value);
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  onSubmit(): void {
    this.submitted = true;
    let fullName = this.clientGroup.get("name").value.toString();
    if (!this.company) {
      fullName += " ";
      fullName += this.clientGroup.get("lastname").value.toString();
    }

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

    const clientCreate: ClientCreate = {
      name: this.clientGroup.get("name").value,
      lastname: this.clientGroup.get("lastname").value,
      isCompany: this.company,
      contacts,
      mail1: this.clientGroup.get("mail1").value,
      mail2: this.clientGroup.get("mail2").value,
      tel1: this.clientGroup.get("tel1").value,
      tel2: this.clientGroup.get("tel2").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_number: this.clientGroup.get("vat_number").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fiscal_code: this.clientGroup.get("fiscal_code").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      codice_destinatario: this.clientGroup.get("codice_destinatario").value,
      pec: this.clientGroup.get("pec").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      esigibilita_iva: "", //this.clientGroup.get("esigibilita_iva").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      publica_amministrazione: false, //this.clientGroup.get("publica_amministrazione").value,
      cup: "", //this.clientGroup.get("cup").value,
      cig: "", //this.clientGroup.get("cig").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      contact_person: this.clientGroup.get("contact_person").value,
      address: {
        name: fullName,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: this.clientGroup.get("address.street_number").value,
        city: this.clientGroup.get("address.city").value,
        cap: this.clientGroup.get("address.cap").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        country_code: this.clientGroup.get("address.country").value,
      },
      // eslint-disable-next-line @typescript-eslint/naming-convention
      gender_code: this.clientGroup.get("gender").value,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      language_code: this.clientGroup.get("language").value,
    };

    if (this.createMode) {
      this.api.createClientClientPost(clientCreate).subscribe(
        (client) => {
          this.createUpdateSuccess(client);
        },
        (error) => {
          this.createUpdateError(error);
        },
        () => {
          this.createUpdateComplete();
        },
      );
    } else {
      this.api.updateClientClientClientIdPut(this.id, clientCreate).subscribe(
        (client) => {
          this.createUpdateSuccess(client);
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

  createUpdateSuccess(client: Client): void {
    this.id = client.id;
    this.router.navigateByUrl("client/" + this.id.toString(), {
      replaceUrl: true,
    });
  }

  companyCheckBoxClicked(): void {
    this.company = !this.company;
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$
        .pipe(tap((client) => this.clientGroup.patchValue(client)))
        .subscribe((client) => {
          this.company = client.isCompany;
          this.clientGroup.patchValue({
            language: client.language.code,
            gender: client.gender.code,
            address: {
              country: client.address.country.code,
            },
          });
          for (const contact of client.contacts) {
            this.addContact(contact);
          }
        });
    }
  }

  getAddressGroup(): UntypedFormGroup {
    return this.clientGroup.get("address") as UntypedFormGroup;
  }

  getContacts(): UntypedFormArray {
    return this.clientGroup.get("contacts") as UntypedFormArray;
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
        name: new UntypedFormControl(this.clientGroup.get("name").value),
        name1: new UntypedFormControl(""),
        lastname: new UntypedFormControl(
          this.clientGroup.get("lastname").value,
        ),
        tel: new UntypedFormControl("+39"),
        mail: new UntypedFormControl(""),
        note: new UntypedFormControl(""),
      });
    }
  }

  removeContactAt(index: number): void {
    this.getContacts().removeAt(index);
  }
}

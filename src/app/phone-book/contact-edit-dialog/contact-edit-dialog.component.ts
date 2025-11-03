import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { first, map, startWith } from "rxjs/operators";
import { Observable } from "rxjs";
import { DefaultService, ContactTypeEnum, ContactCreate } from "../../../api/openapi";

export interface ContactDialogData {
  id: number;
}

interface AutoCompleteOption {
  id: number;
  name: string;
}

@Component({
    selector: "app-contact-edit-dialog",
    templateUrl: "./contact-edit-dialog.component.html",
    styleUrls: ["./contact-edit-dialog.component.scss"],
    standalone: false
})
export class ContactEditDialogComponent implements OnInit {
  createMode = false;
  title = "Kontakt bearbeiten";
  contactGroup: UntypedFormGroup;
  contactType: UntypedFormControl;
  supplierAutoCompleteText: UntypedFormControl = new UntypedFormControl("");
  clientAutoCompleteText: UntypedFormControl = new UntypedFormControl("");

  supplierSelectedId = -1;
  supplierSelectedName = "";
  clientSelectedId = -1;
  clientSelectedName = "";

  businessEnum = ContactTypeEnum.Business;
  clientEnum = ContactTypeEnum.Client;
  supplierEnum = ContactTypeEnum.Supplier;
  managementEnum = ContactTypeEnum.Management;

  showAutoComplete = false;
  showClientAutoComplete = false;
  showSupplierAutoComplete = false;

  supplierOptions: AutoCompleteOption[] = [];
  clientOptions: AutoCompleteOption[] = [];
  filteredSupplierOptions: Observable<AutoCompleteOption[]>;
  filteredClientOptions: Observable<AutoCompleteOption[]>;

  constructor(
    public dialogRef: MatDialogRef<ContactDialogData>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ContactDialogData,
    private api: DefaultService,
  ) { }

  ngOnInit(): void {
    this.contactType = new UntypedFormControl(ContactTypeEnum.Business);
    this.clientAutoCompleteText = new UntypedFormControl(-1);
    this.supplierAutoCompleteText = new UntypedFormControl(-1);
    this.initContactGroup();
    if (this.data.id <= 0) {
      this.createMode = true;
      this.title = "Kontakt erstellen";
    } else {
      this.api
        .readContactContactContactIdGet(this.data.id)
        .pipe(first())
        .subscribe((contact) => {
          this.contactGroup.get("name").setValue(contact.name);
          this.contactGroup.get("name1").setValue(contact.name1);
          this.contactGroup.get("lastname").setValue(contact.lastname);
          this.contactGroup.get("tel").setValue(contact.tel);
          this.contactGroup.get("mail").setValue(contact.mail);
          this.contactGroup.get("note").setValue(contact.note);
          this.contactType.setValue(contact.type);
          if (contact.type === ContactTypeEnum.Supplier) {
            this.showSupplierAutoComplete = true;
            this.api
              .readSupplierByContactSupplierContactContactIdGet(contact.id)
              .pipe(first())
              .subscribe((supplier) => {
                this.supplierSelectedName = supplier.name;
                this.supplierSelectedId = supplier.id;
              });
          }
          if (contact.type === ContactTypeEnum.Client) {
            this.showClientAutoComplete = true;
            this.api
              .readClientByContactClientContactContactIdGet(contact.id)
              .pipe(first())
              .subscribe((client) => {
                this.clientSelectedName = client.fullname;
                this.clientSelectedId = client.id;
              });
          }
        });
    }
    this.contactType.valueChanges.subscribe((value) => {
      this.contactTypeChanged(value);
    });
    this.api
      .readSuppliersSupplierGet(0, 10000)
      .pipe(first())
      .subscribe((suppliers) => {
        for (const supplier of suppliers) {
          const autoCompleteOptions: AutoCompleteOption = {
            id: supplier.id,
            name: supplier.name,
          };
          this.supplierOptions.push(autoCompleteOptions);
        }
        this.filteredSupplierOptions =
          this.supplierAutoCompleteText.valueChanges.pipe(
            startWith(""),
            map((value) => {
              const name = typeof value === "string" ? value : value?.name;
              return name
                ? this.filterSuppliers(name as string)
                : this.clientOptions.slice();
            }),
          );
      });
    this.api
      .readClientsClientGet(0, 10000)
      .pipe(first())
      .subscribe((clients) => {
        for (const client of clients) {
          const autoCompleteOptions: AutoCompleteOption = {
            id: client.id,
            name: client.fullname,
          };
          this.clientOptions.push(autoCompleteOptions);
        }
        this.filteredClientOptions =
          this.clientAutoCompleteText.valueChanges.pipe(
            startWith(""),
            map((value) => {
              const name = typeof value === "string" ? value : value?.name;
              return name
                ? this.filterClients(name as string)
                : this.clientOptions.slice();
            }),
          );
      });
  }

  canSave(): boolean {
    return (
      this.contactGroup.get("tel").value.trim().length <= 3 &&
      this.contactGroup.get("mail").value.trim().length === 0
    );
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    return (
      !(charCode > 31 && (charCode < 48 || charCode > 57)) || charCode === 43
    );
  }

  displayFn(autoCompleteOption: AutoCompleteOption): string {
    return autoCompleteOption && autoCompleteOption.name
      ? autoCompleteOption.name
      : "";
  }

  contactTypeChanged(contactType: ContactTypeEnum): void {
    this.showClientAutoComplete = false;
    this.showSupplierAutoComplete = false;

    switch (contactType) {
      case ContactTypeEnum.Business:
      case ContactTypeEnum.Management:
        return;
      case ContactTypeEnum.Supplier:
        this.showSupplierAutoComplete = true;
        break;
      case ContactTypeEnum.Client:
        this.showClientAutoComplete = true;
        break;
    }
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    const contactCreate: ContactCreate = {
      name: this.contactGroup.get("name").value,
      name1: this.contactGroup.get("name1").value,
      lastname: this.contactGroup.get("lastname").value,
      tel: this.contactGroup.get("tel").value,
      mail: this.contactGroup.get("mail").value,
      note: this.contactGroup.get("note").value,
      id: this.data.id,
    };
    let parentId: number;
    if (this.contactType.value === ContactTypeEnum.Supplier) {
      parentId = this.supplierSelectedId;
    }
    if (this.contactType.value === ContactTypeEnum.Client) {
      parentId = this.clientSelectedId;
    }
    if (this.createMode) {
      this.api
        .createContactContactPost(
          ContactTypeEnum.Business,
          contactCreate,
          parentId,
        )
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    } else {
      this.api
        .updateContactContactContactIdPut(
          this.data.id,
          this.contactType.value,
          contactCreate,
          parentId,
        )
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  onDeleteClick() {
    this.api
      .deleteContactContactContactIdDelete(this.data.id)
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  getSupplierId(supplier) {
    this.supplierSelectedId = supplier.id;
    //this.supplierSelectedName = supplier.name;
  }

  getClientId(client) {
    this.clientSelectedId = client.id;
    //this.clientSelectedName = client.name;
  }

  private filterClients(name: string): AutoCompleteOption[] {
    const filterValue = name.toLowerCase();
    return this.clientOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
  }

  private filterSuppliers(name: string): AutoCompleteOption[] {
    const filterValue = name.toLowerCase();
    return this.supplierOptions.filter((option) =>
      option.name.toLowerCase().includes(filterValue),
    );
  }

  private initContactGroup() {
    this.contactGroup = new UntypedFormGroup({
      name: new UntypedFormControl(""),
      name1: new UntypedFormControl(""),
      lastname: new UntypedFormControl(""),
      tel: new UntypedFormControl("+39"),
      mail: new UntypedFormControl(""),
      note: new UntypedFormControl(""),
    });
  }
}

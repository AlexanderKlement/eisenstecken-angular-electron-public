import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ContactCreate, DefaultService} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup} from '@angular/forms';
import {first} from 'rxjs/operators';

export interface ContactDialogData {
    id: number;
}

@Component({
    selector: 'app-contact-edit-dialog',
    templateUrl: './contact-edit-dialog.component.html',
    styleUrls: ['./contact-edit-dialog.component.scss']
})
export class ContactEditDialogComponent implements OnInit {

    createMode = false;
    title = 'Kontakt bearbeiten';
    contactGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<ContactDialogData>, private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA) public data: ContactDialogData, private api: DefaultService) {
    }

    ngOnInit(): void {
        this.initContactGroup();
        if (this.data.id <= 0) {
            this.createMode = true;
            this.title = 'Kontakt erstellen';
        } else {
            this.api.readContactContactContactIdGet(this.data.id).pipe(first()).subscribe((contact) => {
                this.contactGroup.get('name').setValue(contact.name);
                this.contactGroup.get('name1').setValue(contact.name1);
                this.contactGroup.get('tel').setValue(contact.tel);
                this.contactGroup.get('mail').setValue(contact.mail);
                this.contactGroup.get('note').setValue(contact.note);
            });
        }
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    onSaveClick() {
        const contactCreate: ContactCreate = {
            name: this.contactGroup.get('name').value,
            name1: this.contactGroup.get('name1').value,
            tel: this.contactGroup.get('tel').value,
            mail: this.contactGroup.get('mail').value,
            note: this.contactGroup.get('note').value,
            id: this.data.id,
        };
        if (this.createMode) {
            this.api.createContactContactPost(contactCreate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.api.updateContactContactContactIdPut(this.data.id, contactCreate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    onDeleteClick() {
        this.api.deleteContactContactContactIdDelete(this.data.id).pipe(first()).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    private initContactGroup() {
        this.contactGroup = new FormGroup({
            name: new FormControl(''),
            name1: new FormControl(''),
            tel: new FormControl(''),
            mail: new FormControl(''),
            note: new FormControl('')
        });
    }
}

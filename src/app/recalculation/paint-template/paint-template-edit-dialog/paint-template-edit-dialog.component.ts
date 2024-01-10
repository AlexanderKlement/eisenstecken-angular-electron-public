import {Component, Inject, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {
    DefaultService,
    TemplatePaintCreate, TemplatePaintUpdate,
    Unit,
} from 'eisenstecken-openapi-angular-library';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {first} from 'rxjs/operators';

export interface PaintTemplateEditDialogData {
    id: number;
}

@Component({
    selector: 'app-paint-template-edit-dialog',
    templateUrl: './paint-template-edit-dialog.component.html',
    styleUrls: ['./paint-template-edit-dialog.component.scss']
})
export class PaintTemplateEditDialogComponent implements OnInit {

    title = 'Oberflächen-Vorlage bearbeiten';
    templatePaintEditGroup: UntypedFormGroup;
    createMode = false;
    unitOptions$: Observable<Unit[]>;


    constructor(public dialogRef: MatDialogRef<PaintTemplateEditDialogData>,
                @Inject(MAT_DIALOG_DATA) public data: PaintTemplateEditDialogData, private api: DefaultService) {
    }

    ngOnInit(): void {
        if (this.data.id <= 0) {
            this.createMode = true;
            this.title = 'Oberflächen-Vorlage erstellen';
        }
        this.initTemplatePaintEditGroup();
        this.fillTemplateEditGroup();
        this.unitOptions$ = this.api.readUnitsUnitGet();
    }


    onSaveClick() {
        if (this.createMode) {
            const templatePaintCreate: TemplatePaintCreate = {
                price: this.templatePaintEditGroup.get('price').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: this.templatePaintEditGroup.get('unit_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name: this.templatePaintEditGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
            };
            this.api.createTemplatePaintTemplatePaintPost(templatePaintCreate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            const templatePaintUpdate: TemplatePaintUpdate = {
                price: this.templatePaintEditGroup.get('price').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: this.templatePaintEditGroup.get('unit_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name: this.templatePaintEditGroup.get('name').value,
            };
            this.api.updateTemplatePaintTemplatePaintTemplatePaintIdPut(this.data.id, templatePaintUpdate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    onDeleteClick() {
        this.api.deleteTemplatePaintTemplatePaintTemplatePaintIdDelete(this.data.id).pipe(first()).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    private initTemplatePaintEditGroup() {
        this.templatePaintEditGroup = new UntypedFormGroup({
            name: new UntypedFormControl(''),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            unit_id: new UntypedFormControl(4),
            price: new UntypedFormControl(0),
        });
    }

    private fillTemplateEditGroup() {
        this.api.readTemplatePaintTemplatePaintTemplatePaintIdGet(this.data.id).pipe(first()).subscribe((templatePaint => {
            this.templatePaintEditGroup.get('name').setValue(templatePaint.name);
            this.templatePaintEditGroup.get('unit_id').setValue(templatePaint.unit.id);
            this.templatePaintEditGroup.get('price').setValue(templatePaint.price.toFixed(2));
        }));
    }

}

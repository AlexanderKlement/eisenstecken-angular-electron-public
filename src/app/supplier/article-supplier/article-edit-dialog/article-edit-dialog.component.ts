import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ArticleCreate, ArticleUpdateFull, DefaultService, Unit, Vat} from 'eisenstecken-openapi-angular-library';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';

export interface ArticleEditDialogData {
    id: number;
    supplierId: number;
}

@Component({
    selector: 'app-article-edit-dialog',
    templateUrl: './article-edit-dialog.component.html',
    styleUrls: ['./article-edit-dialog.component.scss']
})
export class ArticleEditDialogComponent implements OnInit {

    title = 'Artikel bearbeiten';
    articleEditGroup: FormGroup;
    createMode = false;
    vatOptions$: Observable<Vat[]>;
    unitOptions$: Observable<Unit[]>;


    constructor(public dialogRef: MatDialogRef<ArticleEditDialogData>,
                @Inject(MAT_DIALOG_DATA) public data: ArticleEditDialogData, private api: DefaultService) {
    }

    ngOnInit(): void {
        if (this.data.id <= 0) {
            this.createMode = true;
            this.title = 'Artikel erstellen';
        }
        this.initArticleEditGroup();
        this.fillArticleEditGroup();
        this.vatOptions$ = this.api.readVatsVatGet();
        this.unitOptions$ = this.api.readUnitsUnitGet();
    }


    onSaveClick() {
        if (this.createMode) {
            const articleCreate: ArticleCreate = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mod_number: this.articleEditGroup.get('mod_number').value,
                price: this.articleEditGroup.get('price').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: this.articleEditGroup.get('unit_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name_de: this.articleEditGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name_it: this.articleEditGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                description_de: this.articleEditGroup.get('description').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                description_it: this.articleEditGroup.get('description').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                vat_id: this.articleEditGroup.get('vat_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                category_ids: [],
                // eslint-disable-next-line @typescript-eslint/naming-convention
                supplier_id: this.data.supplierId,
                favorite: this.articleEditGroup.get('favorite').value
            };
            this.api.createArticleArticlePost(articleCreate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            const articleUpdateFull: ArticleUpdateFull = {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                mod_number: this.articleEditGroup.get('mod_number').value,
                price: this.articleEditGroup.get('price').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: this.articleEditGroup.get('unit_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name_de: this.articleEditGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                name_it: this.articleEditGroup.get('name').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                description_de: this.articleEditGroup.get('description').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                description_it: this.articleEditGroup.get('description').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                vat_id: this.articleEditGroup.get('vat_id').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                category_ids: [],
                favorite: this.articleEditGroup.get('favorite').value
            };
            this.api.updateArticleArticleArticleIdPut(this.data.id, articleUpdateFull).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        }
    }

    onDeleteClick() {
        this.api.deleteArticleArticleArticleIdDelete(this.data.id).pipe(first()).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onCancelClick() {
        this.dialogRef.close();
    }

    private initArticleEditGroup() {
        this.articleEditGroup = new FormGroup({
            name: new FormControl(''),
            description: new FormControl(''),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            unit_id: new FormControl(3),
            price: new FormControl(0),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            mod_number: new FormControl(''),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            vat_id: new FormControl(3),
            favorite: new FormControl(false),
        });
    }

    private fillArticleEditGroup() {
        this.api.readArticleArticleArticleIdGet(this.data.id).pipe(first()).subscribe((article => {
            this.articleEditGroup.get('name').setValue(article.name.translation);
            this.articleEditGroup.get('description').setValue(article.description.translation);
            this.articleEditGroup.get('unit_id').setValue(article.unit.id);
            this.articleEditGroup.get('price').setValue(article.price.toFixed(2));
            this.articleEditGroup.get('mod_number').setValue(article.mod_number);
            this.articleEditGroup.get('vat_id').setValue(article.vat.id);
            this.articleEditGroup.get('favorite').setValue(article.favorite);
        }));
    }
}

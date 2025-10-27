import { Component, Inject, OnInit } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import {
  DefaultService,
  ArticleUpdateFull,
  ArticleCreate,
  Unit,
  Vat,
} from "../../../../api/openapi";

export interface ArticleEditDialogData {
  id: number;
  supplierId: number;
  type: string;
}

@Component({
  selector: "app-article-edit-dialog",
  templateUrl: "./article-edit-dialog.component.html",
  styleUrls: ["./article-edit-dialog.component.scss"],
  standalone: false,
})
export class ArticleEditDialogComponent implements OnInit {
  title = "Artikel bearbeiten";
  articleEditGroup: UntypedFormGroup;
  createMode = false;
  unitOptions$: Observable<Unit[]>;

  constructor(
    public dialogRef: MatDialogRef<ArticleEditDialogData>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: ArticleEditDialogData,
    private api: DefaultService,
  ) {}

  ngOnInit(): void {
    if (this.data.id <= 0) {
      this.createMode = true;
      this.title = "Artikel erstellen";
    }
    this.initArticleEditGroup();
    this.fillArticleEditGroup();
    this.unitOptions$ = this.api.readUnitsUnitGet();
  }

  onSaveClick() {
    if (this.createMode) {
      const articleCreate: ArticleCreate = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        mod_number: this.articleEditGroup.get("mod_number").value,
        price: this.articleEditGroup.get("price").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: this.articleEditGroup.get("unit_id").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name_de: this.articleEditGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name_it: this.articleEditGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        category_ids: [],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        supplier_id: this.data.supplierId,
        favorite: this.articleEditGroup.get("favorite").value,
      };
      this.api
        .createArticleArticlePost(articleCreate)
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    } else {
      const articleUpdateFull: ArticleUpdateFull = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        mod_number: this.articleEditGroup.get("mod_number").value,
        price: this.articleEditGroup.get("price").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: this.articleEditGroup.get("unit_id").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name_de: this.articleEditGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name_it: this.articleEditGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        category_ids: [],
        favorite: this.articleEditGroup.get("favorite").value,
      };
      this.api
        .updateArticleArticleArticleIdPut(this.data.id, articleUpdateFull)
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    }
  }

  onDeleteClick() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Artikel löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.api
          .deleteArticleArticleArticleIdDelete(this.data.id)
          .pipe(first())
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      }
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  private initArticleEditGroup() {
    this.articleEditGroup = new UntypedFormGroup({
      name: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unit_id: new UntypedFormControl(3),
      price: new UntypedFormControl(0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      mod_number: new UntypedFormControl(""),
      favorite: new UntypedFormControl(false),
    });
  }

  private fillArticleEditGroup() {
    this.api
      .readArticleArticleArticleIdGet(this.data.id)
      .pipe(first())
      .subscribe((article) => {
        this.articleEditGroup.get("name").setValue(article.name.translation);
        this.articleEditGroup.get("unit_id").setValue(article.unit.id);
        this.articleEditGroup.get("price").setValue(article.price.toFixed(2));
        this.articleEditGroup.get("mod_number").setValue(article.mod_number);
        this.articleEditGroup.get("favorite").setValue(article.favorite);
      });
  }
}

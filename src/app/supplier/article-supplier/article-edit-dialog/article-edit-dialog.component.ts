import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { ArticleCreate, ArticleUpdateFull, DefaultService, Unit } from "../../../../api/openapi";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

export interface ArticleEditDialogData {
  id: number;
  supplierId: number;
  type: string;
}

@Component({
  selector: "app-article-edit-dialog",
  templateUrl: "./article-edit-dialog.component.html",
  styleUrls: ["./article-edit-dialog.component.scss"],
  imports: [
    MatDialogTitle,
    MatDialogContent,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    FlexModule,
    MatSelect,
    MatOption,
    MatButton,
    AsyncPipe
  ]
})
export class ArticleEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ArticleEditDialogData>>(MatDialogRef);
  private dialog = inject(MatDialog);
  data = inject<ArticleEditDialogData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);

  title = "Artikel bearbeiten";
  articleEditGroup: UntypedFormGroup;
  createMode = false;
  unitOptions$: Observable<Unit[]>;

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
        mod_number: this.articleEditGroup.get("mod_number").value,
        price: this.articleEditGroup.get("price").value,
        unit_id: this.articleEditGroup.get("unit_id").value,
        name_de: this.articleEditGroup.get("name").value,
        name_it: this.articleEditGroup.get("name").value,
        supplier_id: this.data.supplierId,
        favorite: this.articleEditGroup.get("favorite").value
      };
      this.api
        .createArticleArticlePost(articleCreate)
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    } else {
      const articleUpdateFull: ArticleUpdateFull = {
        mod_number: this.articleEditGroup.get("mod_number").value,
        price: this.articleEditGroup.get("price").value,
        unit_id: this.articleEditGroup.get("unit_id").value,
        name_de: this.articleEditGroup.get("name").value,
        name_it: this.articleEditGroup.get("name").value,
        favorite: this.articleEditGroup.get("favorite").value
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
        text: "Dieser Schritt kann nicht rückgängig gemacht werden."
      }
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
      favorite: new UntypedFormControl(false)
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

import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { first } from "rxjs/operators";
import { DefaultService, OrderedArticle, OrderedArticleService, OrderedArticleUpdateV2 } from "../../../../api/openapi";
import { OrderDialogCreateData, OrderDialogReturnData, ProductEditDialogComponent } from "./product-edit-dialog.component";

@Injectable({ providedIn: "root" })
export class OrderedArticleEditDialogService {
  constructor(
    private dialog: MatDialog,
    private api: DefaultService,
    private orderedArticlesService: OrderedArticleService,
    private snackBar: MatSnackBar,
  ) {}

  openEditDialog(
    orderedArticle: OrderedArticle,
    options?: {
      title?: string;
      blockRequestChange?: boolean;
      blockFavoriteChange?: boolean;
      onSuccess?: () => void;
    },
  ): void {
    const dialogData: OrderDialogCreateData = {
      title: options?.title ?? "Produkt bearbeiten",
      amount: orderedArticle.amount,
      name: orderedArticle.article?.name?.translation ?? "",
      price: orderedArticle.price,
      modNumber: orderedArticle.modNumber ?? orderedArticle.article?.mod_number ?? "",
      unitId: orderedArticle.ordered_unit?.id,
      request: orderedArticle.request,
      comment: orderedArticle.comment,
      position: orderedArticle.position,
      createMode: false,
      favorite: orderedArticle.article?.favorite ?? false,
      blockRequestChange: options?.blockRequestChange ?? false,
      blockFavoriteChange: options?.blockFavoriteChange ?? true,
    };

    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: "700px",
      data: dialogData,
    });

    dialogRef.afterClosed().pipe(first()).subscribe((result: OrderDialogReturnData | undefined) => {
      if (!result) return;

      switch (result.mode) {
        case "delete":
          this.api
            .deleteOrderedArticleOrderedArticleOrderedArticleIdDelete(orderedArticle.id)
            .pipe(first())
            .subscribe((success) => {
              if (success) {
                options?.onSuccess?.();
                return;
              }
              this.snackBar.open("Es ist ein Fehler aufgetreten.", "Ok", { duration: 10000 });
            });
          return;

        case "save": {
          const orderedArticleUpdate: OrderedArticleUpdateV2 = {
            amount: result.amount,
            articleId: orderedArticle.article.id,
            orderedUnitId: result.unitId,
            price: result.price,
            comment: result.comment,
            position: result.position,
            request: result.request,
            nameDE: result.name,
            nameIT: result.name,
            modNumber: result.modNumber,
          };

          this.orderedArticlesService
            .updateOrderedArticle(orderedArticle.id, orderedArticleUpdate)
            .pipe(first())
            .subscribe(() => options?.onSuccess?.());
          return;
        }

        case "add":
          console.error("Add mode not supported for ordered-article edit dialog");
          return;

        default:
          return;
      }
    });
  }
}

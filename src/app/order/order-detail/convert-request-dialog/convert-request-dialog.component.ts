import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatSelectionList, MatListOption } from "@angular/material/list";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { DefaultService, OrderedArticle, OrderedArticleService } from "../../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

export interface ConvertOrderedArticleReturnDialogData {
  orderId: number;
}


@Component({
    selector: 'app-convert-request-dialog',
    templateUrl: './convert-request-dialog.component.html',
    styleUrls: ['./convert-request-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatSelectionList, MatListOption, MatDialogActions, MatButton, AsyncPipe]
})
export class ConvertRequestDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ConvertRequestDialogComponent>>(MatDialogRef);
  data = inject<ConvertOrderedArticleReturnDialogData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);
  private orderedArticleService = inject(OrderedArticleService);


  @ViewChild('articles') articlesSelected: MatSelectionList;
  orderedArticles$: Observable<OrderedArticle[]>;

  atLeastOneArticleSelected = false;

  error = false;


  checkSelections(): void {
    this.atLeastOneArticleSelected = this.getSelectedArticleIds().length > 0;
  }

  ngOnInit(): void {
    this.orderedArticles$ = this.api.readOrderOrderOrderIdGet(this.data.orderId).pipe(map(order => order.articles));
  }

  onSubmitClick() {
    this.orderedArticleService.convertArticleRequest(this.getSelectedArticleIds()).pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getSelectedArticleIds(): number[] {
    if (this.articlesSelected !== undefined) {
      return this.articlesSelected.selectedOptions.selected.map((obj) => parseInt(obj.value, 10));
    } else {
      console.warn("OrderDialogComponent: Cannot get selected Options");
      return [];
    }
  }


  orderedArticleClicked(): void {
    this.articlesSelected.selectedOptions.selected.forEach((selected) => {
      console.log(selected);
    });
    this.checkSelections();
  }

}

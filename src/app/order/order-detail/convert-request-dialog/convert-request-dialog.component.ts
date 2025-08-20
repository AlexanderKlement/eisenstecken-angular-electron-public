import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatSelectionList } from "@angular/material/list";
import { combineLatest, Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { DefaultService, OrderedArticle } from "../../../../api/openapi";

export interface ConvertOrderedArticleReturnDialogData {
  orderId: number;
}


export interface OrderedArticleReturnDialogData {
  success: boolean;
}


@Component({
  selector: 'app-convert-request-dialog',
  templateUrl: './convert-request-dialog.component.html',
  styleUrls: ['./convert-request-dialog.component.scss'],
})
export class ConvertRequestDialogComponent implements OnInit {

  @ViewChild('articles') articlesSelected: MatSelectionList;
  orderedArticles$: Observable<OrderedArticle[]>;

  atLeastOneArticleSelected = false;

  error = false;

  constructor(public dialogRef: MatDialogRef<ConvertRequestDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ConvertOrderedArticleReturnDialogData,
              private api: DefaultService) {
  }


  checkSelections(): void {
    this.atLeastOneArticleSelected = this.getSelectedArticleIds().length > 0;
  }

  ngOnInit(): void {
    this.orderedArticles$ = this.api.readOrderOrderOrderIdGet(this.data.orderId).pipe(map(order => order.articles));
  }

  onSubmitClick() {
    this.api.convertRequestOrderedArticleConvertRequestsPost(this.getSelectedArticleIds()).pipe(first()).subscribe(() => {
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

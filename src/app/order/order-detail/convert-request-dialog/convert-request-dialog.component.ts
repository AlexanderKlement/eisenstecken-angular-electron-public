import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatSelectionList, MatListOption } from "@angular/material/list";
import { combineLatest, Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { DefaultService, OrderedArticle } from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";

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
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatSelectionList, MatListOption, MatDialogActions, MatButton, AsyncPipe]
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

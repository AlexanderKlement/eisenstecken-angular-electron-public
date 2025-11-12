import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatSelectionList, MatListOption, MatList, MatListItem } from '@angular/material/list';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DefaultService, Job, Stock, OrderedArticle, OrderableType } from '../../../../api/openapi';
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from 'ng-flex-layout';
import { MatStepper, MatStep, MatStepLabel, MatStepperNext, MatStepperPrevious } from '@angular/material/stepper';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';

export interface OrderedArticleMoveDialogData {
  orderId: number;
}


export interface OrderedArticleReturnDialogData {
  success: boolean;
}

interface SimpleOrderable {
  id: number;
  name: string;
}

@Component({
  selector: 'app-ordered-article-move-dialog',
  templateUrl: './ordered-article-move-dialog.component.html',
  styleUrls: ['./ordered-article-move-dialog.component.scss'],
  imports: [MatDialogTitle, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatStepper, MatStep, MatStepLabel, MatSelectionList, MatListOption, MatButton, MatStepperNext, MatStepperPrevious, MatList, MatListItem, MatDialogActions, AsyncPipe],
})
export class OrderedArticleMoveDialogComponent implements OnInit {

  @ViewChild('articles') articlesSelected: MatSelectionList;
  @ViewChild('orderable') orderableSelected: MatSelectionList;
  orderedArticles$: Observable<OrderedArticle[]>;
  orderableTargets$: Observable<SimpleOrderable[]>;

  atLeastOneArticleSelected = false;
  oneOrderableSelected = false;

  error = false;

  constructor(public dialogRef: MatDialogRef<OrderedArticleMoveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: OrderedArticleMoveDialogData,
              private api: DefaultService) {
  }


  jobStock2SimpleOrderable = (element: Job | Stock): SimpleOrderable => ({
    id: element.id,
    name: element.displayable_name,
  });

  checkSelections(): void {
    this.atLeastOneArticleSelected = this.getSelectedArticleIds().length > 0;
    this.oneOrderableSelected = this.getSelectedOrderable() > 0;
  }

  ngOnInit(): void {
    this.orderedArticles$ = this.api.readOrderOrderOrderIdGet(this.data.orderId).pipe(map(order => order.articles));
    const jobs$ = this.api.readJobsJobGet(0, 1000, '', undefined, 'JOBSTATUS_ACCEPTED');
    const stocks$ = this.api.readStocksStockGet();
    const order$ = this.api.readOrderOrderOrderIdGet(this.data.orderId);
    combineLatest([stocks$, jobs$, order$]).pipe(first()).subscribe(([stocks, jobs, order]) => {
      const stockOrderables = stocks.map(this.jobStock2SimpleOrderable);
      const jobOrderables = jobs.map(this.jobStock2SimpleOrderable);
      this.orderableTargets$ = new Observable<SimpleOrderable[]>((subscriber => {
        if (order.order_from.type === OrderableType.Supplier) {
          subscriber.next(stockOrderables.concat(jobOrderables));
        } else {
          subscriber.next(jobOrderables);
        }
      }));
    });
  }

  onSubmitClick() {
    this.api.moveOrderedArticlesOrderMoveOldOrderIdNewOrderableToIdPost(this.data.orderId,
      this.getSelectedOrderable(), this.getSelectedArticleIds())
      .pipe(first()).subscribe((result) => {
      const response: OrderedArticleReturnDialogData = {
        success: result !== undefined,
      };
      this.dialogRef.close(response);
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  getSelectedArticleIds(): number[] {
    return this.articlesSelected
      ? this.articlesSelected.selectedOptions.selected
        .map(o => (o.value as OrderedArticle).id)
      : [];
  }

  getSelectedOrderable(): number {
    return this.orderableSelected?.selectedOptions.selected[0]
      ? (this.orderableSelected.selectedOptions.selected[0].value as SimpleOrderable).id
      : -1;
  }


  orderedArticleClicked(): void {
    this.articlesSelected.selectedOptions.selected.forEach((selected) => {
      console.log(selected);
    });
    this.checkSelections();
  }

  orderableClicked(): void {
    this.checkSelections();
  }
}

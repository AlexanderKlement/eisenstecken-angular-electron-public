import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TableDataSource } from './table-builder.datasource';
import { MatPaginator } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { DataSourceClass } from '../../types';
import { ThemePalette } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

export interface TableButton {
  name: (values: any) => string;
  class: (values: any) => string;
  color: (values: any) => ThemePalette;
  navigate: ($event: any, id: number) => void;
  selectedField: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
  ],
  selector: 'app-table-builder',
  templateUrl: './table-builder.component.html',
  styleUrls: ['./table-builder.component.scss'],
})
export class TableBuilderComponent<T extends DataSourceClass>
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() dataSource: TableDataSource<T>;
  @Input() title?: string;
  @Input() buttons?: TableButton[] = [];
  @Input() $refresh?: Observable<void>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;
  subscription: Subscription;
  refreshInterval: NodeJS.Timeout;
  refreshRateSeconds = 60;

  constructor() {}

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.addButtons();
    this.refreshInterval = setInterval(() => {
      this.loadDataPage(false);
    }, this.refreshRateSeconds * 1000);
    if (this.$refresh) {
      this.subscription.add(
        this.$refresh.subscribe(() => {
          this.loadDataPage(false);
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.dataSource && !changes.dataSource.firstChange) {
      this.addButtons();
    }
  }

  addButtons(): void {
    if (this.buttons.length > 0) {
      this.dataSource.columnIdentifiers.push('actions');
      this.dataSource.columns.push({
        name: 'actions',
        headerName: 'Aktionen',
      });
    }
  }

  ngAfterViewInit(): void {
    this.subscription.add(
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(150),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;
            this.loadDataPage();
          })
        )
        .subscribe()
    );

    this.subscription.add(
      this.paginator.page.pipe(tap(() => this.loadDataPage())).subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.refreshInterval);
  }

  public rowClicked(route: VoidFunction): void {
    route();
  }

  private loadDataPage(enableLoading = true) {
    this.dataSource.loadData(
      this.input.nativeElement.value,
      '',
      this.paginator.pageIndex,
      this.paginator.pageSize,
      enableLoading
    );
  }
}

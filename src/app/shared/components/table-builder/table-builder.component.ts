import {
  AfterViewInit, booleanAttribute,
  Component,
  ElementRef, inject,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import { SortFunction, TableDataSource } from "./table-builder.datasource";
import { MatPaginator } from "@angular/material/paginator";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { fromEvent, Observable, Subscription } from "rxjs";
import { DataSourceClass } from "../../types";
import { ThemePalette } from "@angular/material/core";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import { MatFormField, MatInput } from "@angular/material/input";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import { MatButton } from "@angular/material/button";
import { MatTooltip } from "@angular/material/tooltip";
import { AsyncPipe, NgClass } from "@angular/common";
import { DefaultService, OrderService, RecalculationService } from "../../../../api/openapi";
import { MatSort, MatSortHeader, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";

export interface TableButton {
  name: (values: any) => string;
  class: (values: any) => string;
  color: (values: any) => ThemePalette;
  navigate: ($event: any, id: number) => void;
  selectedField: string;
}

type AnyApi = DefaultService | RecalculationService | OrderService;

@Component({
  selector: "app-table-builder",
  templateUrl: "./table-builder.component.html",
  styleUrls: ["./table-builder.component.scss"],
  imports: [
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormField,
    MatInput,
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRow,
    MatTooltip,
    MatPaginator,
    AsyncPipe,
    NgClass,
    MatRowDef,
    MatCellDef,
    MatHeaderCellDef,
    MatSortHeader,
    MatSort
  ]
})

export class TableBuilderComponent<T extends DataSourceClass, A extends AnyApi = AnyApi>
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() dataSource!: TableDataSource<T, A>;
  @Input() title?: string;
  @Input({ transform: booleanAttribute }) noSearch?: boolean = false;
  @Input() buttons?: TableButton[] = [];
  @Input() $refresh?: Observable<void>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("input") input: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  subscription: Subscription;
  refreshInterval: NodeJS.Timeout;
  refreshRateSeconds = 60;

  constructor() {
  }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.addButtons();
    this.refreshInterval = setInterval(() => {
      this.loadDataPage(false);
    }, this.refreshRateSeconds * 1000);
    if (!!this.$refresh) {
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
      this.dataSource.columnIdentifiers.push("actions");
      this.dataSource.columns.push({
        name: "actions",
        headerName: "Aktionen"
      });
    }
  }

  ngAfterViewInit(): void {
    if (!this.noSearch) {
      this.subscription.add(
        fromEvent(this.input.nativeElement, "keyup")
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
    }
    this.subscription.add(
      this.paginator.page.pipe(tap(() => this.loadDataPage())).subscribe()
    );
    this.sort.sortChange.subscribe((s) => {
      this.dataSource.onSort(s);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearInterval(this.refreshInterval);
  }

  public rowClicked(route: VoidFunction): void {
    route();
  }

  private loadDataPage(enableLoading: boolean = true) {
    this.dataSource.loadData(
      !this.noSearch ? this.input.nativeElement.value : undefined,
      "",
      this.paginator.pageIndex,
      this.paginator.pageSize,
      enableLoading
    );
  }
}

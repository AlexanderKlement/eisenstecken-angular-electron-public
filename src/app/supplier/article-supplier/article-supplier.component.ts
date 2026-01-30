import { Component, OnInit } from "@angular/core";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import {
  Column,
  TableDataSource,
} from "../../shared/components/table-builder/table-builder.datasource";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import {
  ArticleEditDialogComponent,
  ArticleEditDialogData,
} from "./article-edit-dialog/article-edit-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { DefaultService, Article } from "../../../api/openapi";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";

@Component({
    selector: "app-article-supplier",
    templateUrl: "./article-supplier.component.html",
    styleUrls: ["./article-supplier.component.scss"],
    imports: [ToolbarComponent, TableBuilderComponent],
})
export class ArticleSupplierComponent implements OnInit {
  buttons: CustomButton[] = [];
  articleTableSource: TableDataSource<Article, DefaultService>;
  supplierId: number;
  title = "Artikel";
  type: string;

  columns: Column<Article>[] = [
    { name: "name", headerName: "Name" },
    { name: "unit", headerName: "Einheit" },
    { name: "price", headerName: "Preis" },
    // {name: "vat", headerName: "MwSt."},
    { name: "mod_number", headerName: "Mod Nummer" },
    { name: "favorite", headerName: "Favorit" },
    { name: "last_order_date", headerName: "Letztes Bestelldatum" },
  ];

  constructor(
    private dialog: MatDialog,
    private api: DefaultService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  parseFunction = (dataSourceClasses: Article[]) => {
    const rows = [];
    dataSourceClasses.forEach((dataSource) => {
      rows.push({
        values: {
          name: dataSource.name.translation,
          unit: dataSource.unit.name.translation,
          price: dataSource.price.toFixed(2).replace(".", ",") + " €",
          // vat: dataSource.vat.name,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          mod_number: dataSource.mod_number,
          favorite: dataSource.favorite ? "Ja" : "Nein",
          last_order_date: dataSource.last_order_date
            ? new Date(dataSource.last_order_date).toLocaleDateString()
            : "-",
        },
        route: () => {
          this.articleClicked(dataSource.id);
        },
      });
    });
    return rows;
  };

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.supplierId = parseInt(params.supplier_id, 10);
      console.log(this.supplierId);
      if (isNaN(this.supplierId)) {
        console.error("RecalculationDetail: Cannot parse jobId");
        this.router.navigateByUrl("supplier");
        return;
      }
      this.route.data.subscribe((data) => {
        this.type = data.type;
        if (data.type === "supplier") {
          this.initArticleSupplierTable();
          this.api
            .readSupplierSupplierSupplierIdGet(this.supplierId)
            .pipe(first())
            .subscribe((supplier) => {
              this.title += ": " + supplier.name;
            });
        } else {
          this.initArticleStockTable();
          this.api
            .readStockStockStockIdGet(this.supplierId)
            .pipe(first())
            .subscribe((stock) => {
              this.title += ": " + stock.name;
            });
        }
      });
    });
    this.buttons.push({
      name: "Neuer Artikel",
      navigate: () => {
        this.openArticleDialog(-1, this.supplierId, this.type);
      },
    });
  }

  private initArticleSupplierTable() {
    this.articleTableSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readArticlesBySupplierArticleSupplierSupplierIdGet(
          this.supplierId,
          skip,
          limit,
          filter,
        ),
      this.parseFunction,
      this.columns,
      (api) =>
        api.readArticleCountBySupplierArticleSupplierCountSupplierIdGet(
          this.supplierId,
        ),
    );
    this.articleTableSource.loadData();
  }

  private initArticleStockTable() {
    this.articleTableSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readArticlesByStockArticleStockStockIdGet(
          this.supplierId,
          skip,
          limit,
          filter,
        ),
      this.parseFunction,
      this.columns,
      (api) =>
        api.readArticleCountBySupplierArticleSupplierCountSupplierIdGet(
          this.supplierId,
        ),
    );
    this.articleTableSource.loadData();
  }

  private articleClicked(id: number) {
    this.openArticleDialog(id, -1, this.type);
  }

  private openArticleDialog(id: number, supplierId: number, type: string) {
    const dialogData: ArticleEditDialogData = {
      id,
      type,
      supplierId, //this is not really important, since i can get it from the article her
    };
    const dialogRef = this.dialog.open(ArticleEditDialogComponent, {
      width: "500px",
      data: dialogData,
    });
    dialogRef
      .afterClosed()
      .pipe(first())
      .subscribe((result) => {
        if (result) {
          this.articleTableSource.loadData();
        }
      });
  }
}

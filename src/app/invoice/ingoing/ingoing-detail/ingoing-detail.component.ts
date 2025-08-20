import { Component, ComponentRef, OnInit } from "@angular/core";
import { InfoDataSource } from "../../../shared/components/info-builder/info-builder.datasource";
import { ActivatedRoute } from "@angular/router";
import { TableDataSource } from "../../../shared/components/table-builder/table-builder.datasource";
import { formatCurrency, formatNumber } from "@angular/common";
import { Observable, Subscriber } from "rxjs";
import { DefaultService, DescriptiveArticle, IngoingInvoice } from "../../../../api/openapi";

@Component({
  selector: 'app-ingoing-detail',
  templateUrl: './ingoing-detail.component.html',
  styleUrls: ['./ingoing-detail.component.scss'],
})
export class IngoingDetailComponent implements OnInit {

  infoDataSource: InfoDataSource<IngoingInvoice>;
  descriptiveArticleSource: TableDataSource<DescriptiveArticle>;
  id: number;
  title: "Rechnung: Details";
  public $refresh: Observable<void>;
  private $refreshSubscriber: Subscriber<void>;

  constructor(private api: DefaultService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      try {
        this.id = parseInt(params.id, 10);
      } catch {
        console.error("Cannot parse given id");
        return;
      }
      if (isNaN(this.id)) {
        return;
      }
      this.initIngoingInvoiceDetail();
      this.initDescriptiveArticleTable();
    });
    this.initRefreshObservables();
  }

  initRefreshObservables(): void {
    this.$refresh = new Observable<void>((subscriber => {
      this.$refreshSubscriber = subscriber;
    }));
  }

  onAttach(ref: ComponentRef<any>, activatedRoute: ActivatedRoute): void {
    console.log("Getting attached");
    this.$refreshSubscriber.next();
  }

  initIngoingInvoiceDetail(): void {
    this.infoDataSource = new InfoDataSource<IngoingInvoice>(
      this.api.readIngoingInvoiceIngoingInvoiceIngoingInvoiceIdGet(this.id),
      [
        {
          property: "name",
          name: "Firma",
        },
        {
          property: "number",
          name: "Nummer",
        },
        {
          property: "date_formatted",
          name: "Datum",
        },
      ],
      "", undefined, undefined, undefined,
    );
  }

  initDescriptiveArticleTable(): void {
    this.descriptiveArticleSource = new TableDataSource<DescriptiveArticle>(
      this.api,
      (api: DefaultService, filter, sortDirection, skip, limit) =>
        api.readIngoingInvoicesIngoingInvoiceArticlesIngoingInvoiceIdGet(this.id, skip, limit, filter)
      ,
      dataSourceClasses => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                description: dataSource.description,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                single_price: formatCurrency(dataSource.single_price, "de-DE", "EUR"),
                amount: formatNumber(dataSource.amount, "de-DE", ".2"),
                unit: dataSource.unit.name.translation,
                discount: formatNumber(dataSource.discount, "de-DE", ".2") + " %",
                vat: dataSource.vat.name,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                total_with: formatCurrency(dataSource.single_price * dataSource.amount * (1 -
                  dataSource.discount / 100) * (1 + dataSource.vat.amount / 100),
                  "de-DE", "EUR"),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                total_without: formatCurrency(dataSource.single_price * dataSource.amount * (1 -
                  dataSource.discount / 100),
                  "de-DE", "EUR"),
              },
              route: () => {
                console.log(dataSource);
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Name" },
        { name: "description", headerName: "Beschreibung" },
        { name: "single_price", headerName: "Einzelpreis" },
        { name: "amount", headerName: "Menge" },
        { name: "unit", headerName: "Einheit" },
        { name: "discount", headerName: "Rabatt" },
        { name: "vat", headerName: "MwSt." },
        { name: "total_without", headerName: "Gesamt [ohne MwSt.]" },
        { name: "total_with", headerName: "Gesamt [mit MwSt.]" },
      ],
      (api) => api.readIngoingInvoicesIngoingInvoiceArticlesCountIngoingInvoiceIdGet(this.id),
    );
    this.descriptiveArticleSource.loadData();
  }

}

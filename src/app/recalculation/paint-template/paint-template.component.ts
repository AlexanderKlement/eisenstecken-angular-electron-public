import { Component, OnInit } from "@angular/core";
import { CustomButton } from "../../shared/components/toolbar/toolbar.component";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import { formatCurrency } from "@angular/common";
import { first } from "rxjs/operators";
import {
  PaintTemplateEditDialogComponent,
  PaintTemplateEditDialogData,
} from "./paint-template-edit-dialog/paint-template-edit-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DefaultService, TemplatePaint } from "../../../api/openapi";

@Component({
    selector: 'app-paint-template',
    templateUrl: './paint-template.component.html',
    styleUrls: ['./paint-template.component.scss'],
    standalone: false
})
export class PaintTemplateComponent implements OnInit {

  buttons: CustomButton[] = [
    {
      name: "Neue Oberflächen-Vorlage",
      navigate: () => {
        this.openPaintTemplateDialog(-1);
      },
    },
  ];
  paintTemplateDataSource: TableDataSource<TemplatePaint>;
  supplierId: number;
  title = "Oberflächen Vorlagen";

  constructor(private api: DefaultService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.initPaintTemplateDataSource();
  }

  private initPaintTemplateDataSource() {
    this.paintTemplateDataSource = new TableDataSource<TemplatePaint>(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readTemplatePaintsTemplatePaintGet(skip, limit),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push(
            {
              values: {
                name: dataSource.name,
                unit: dataSource.unit.name.translation,
                price: formatCurrency(dataSource.price, "de-DE", "EUR"),
              },
              route: () => {
                this.openPaintTemplateDialog(dataSource.id);
              },
            });
        });
        return rows;
      },
      [
        { name: "name", headerName: "Bezeichnung" },
        { name: "unit", headerName: "Einheit" },
        { name: "price", headerName: "Preis" },
      ],
      (api) => api.readTemplatePaintCountTemplatePaintCountGet(),
    );
    this.paintTemplateDataSource.loadData();
  }

  private openPaintTemplateDialog(id: number) {
    const dialogData: PaintTemplateEditDialogData = {
      id,
    };
    const dialogRef = this.dialog.open(PaintTemplateEditDialogComponent, {
      width: "500px",
      data: dialogData,
    });
    dialogRef.afterClosed().pipe(first()).subscribe(result => {
      if (result) {
        this.paintTemplateDataSource.loadData();
      }
    });

  }
}

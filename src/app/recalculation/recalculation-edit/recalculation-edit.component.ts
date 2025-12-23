import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { TableDataSource } from "../../shared/components/table-builder/table-builder.datasource";
import dayjs from "dayjs/esm";
import { minutesToDisplayableString } from "../../shared/date.util";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { FileService } from "../../shared/services/file.service";
import {
  DefaultService,
  Recalculation,
  RecalculationUpdate,
  RecalculationCreate,
  Paint,
  PaintCreate,
  TemplatePaint,
  Expense,
  ExpenseCreate,
  Unit,
  WoodListCreate,
  WoodList,
  Workload,
  Order,
  Lock, OrderSmall,
} from "../../../api/openapi";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
} from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatActionList, MatListItem } from "@angular/material/list";
import { TableBuilderComponent } from "../../shared/components/table-builder/table-builder.component";
import { AsyncPipe } from "@angular/common";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";

@Component({
  selector: 'app-recalculation-edit',
  templateUrl: './recalculation-edit.component.html',
  styleUrls: ['./recalculation-edit.component.scss'],
  imports: [
    ToolbarComponent,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatSelect,
    MatOption,
    MatActionList,
    MatListItem,
    TableBuilderComponent,
    AsyncPipe,
    CircleIconButtonComponent,
  ],
})
export class RecalculationEditComponent
  extends BaseEditComponent<Recalculation>
  implements OnInit, OnDestroy {
  recalculationGroup: UntypedFormGroup;
  navigationTarget = "recalculation";
  jobId: number;
  jobName$: Observable<string>;
  units$: Observable<Unit[]>;
  templatePaints$: Observable<TemplatePaint[]>;

  orderDataSource: TableDataSource<OrderSmall>;
  workloadDataSource: TableDataSource<Workload>;
  title = "Nachkalkulation: Bearbeiten";

  // eslint-disable-next-line max-len
  constructor(
    api: DefaultService,
    router: Router,
    route: ActivatedRoute,
    private file: FileService,
    dialog: MatDialog,
  ) {
    super(api, router, route, dialog);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedRecalculationRecalculationIslockedRecalculationIdGet(id);
  dataFunction = (api: DefaultService, id: number): Observable<Recalculation> =>
    api.readRecalculationRecalculationRecalculationIdGet(id);
  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.unlockRecalculationRecalculationUnlockRecalculationIdPost(id);

  ngOnInit(): void {
    super.ngOnInit();
    this.units$ = this.api.readUnitsUnitGet();
    this.templatePaints$ = this.api.readTemplatePaintsTemplatePaintGet();
    this.initRecalculationsGroup();
    this.routeParams.subscribe((params) => {
      this.jobId = parseInt(params.job_id, 10);
      if (isNaN(this.jobId)) {
        console.error("RecalculationEdit: Cannot parse job id");
        this.router.navigateByUrl(this.navigationTarget);
      }
      this.initOrderTable();
      this.initWorkloadTable();
      this.jobName$ = this.api.readJobJobJobIdGet(this.jobId).pipe(
        first(),
        map((job) => job.displayable_name),
      );
      if (!this.createMode) {
        this.api
          .readRecalculationRecalculationRecalculationIdGet(this.id)
          .pipe(first())
          .subscribe((recalculation) => {
            this.fillFormGroup(recalculation);
            this.addAtLeastOne();
          });
      } else {
        this.api
          .getParameterParameterKeyGet("cost_per_km")
          .pipe(first())
          .subscribe((cost) => {
            this.recalculationGroup.get("cost").setValue(cost);
          });
        this.api
          .readDriveDistanceByJobJourneyDistanceJobIdGet(this.jobId)
          .pipe(first())
          .subscribe((km) => {
            this.recalculationGroup.get("km").setValue(km);
          });
        this.addAtLeastOne();
      }
    });
    if (this.createMode) {
      this.title = "Nachkalkulation: Erstellen";
    }
  }

  addAtLeastOne(): void {
    if (this.getExpenses().length === 0) {
      this.addExpense();
    }
    if (this.getPaints().length === 0) {
      this.addPaint();
    }
    if (this.getWoodLists().length === 0) {
      this.addWoodList();
    }
  }

  initRecalculationsGroup(): void {
    this.recalculationGroup = new UntypedFormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      expenses: new UntypedFormArray([]),
      paints: new UntypedFormArray([]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      wood_lists: new UntypedFormArray([]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      material_charge_percent: new UntypedFormControl(
        30,
        Validators.compose([Validators.min(0), Validators.max(100)]),
      ),
      km: new UntypedFormControl(0.0),
      cost: new UntypedFormControl(0.0),
    });
    this.api
      .getParameterParameterKeyGet("recalculation_percent")
      .pipe(first())
      .subscribe((paramter) => {
        this.recalculationGroup
          .get("material_charge_percent")
          .setValue(parseFloat(paramter));
      });
  }

  fillFormGroup(recalculation: Recalculation): void {
    for (const expense of recalculation.expenses) {
      this.addExpense(expense);
    }
    for (const paint of recalculation.paints) {
      this.addPaint(paint);
    }
    for (const woodList of recalculation.wood_lists) {
      this.addWoodList(woodList);
    }
    this.recalculationGroup.get("km").setValue(recalculation.km);
    this.recalculationGroup.get("cost").setValue(recalculation.cost);
    this.recalculationGroup
      .get("material_charge_percent")
      .setValue(recalculation.material_charge_percent);
  }

  getExpenses(): UntypedFormArray {
    return this.recalculationGroup.get("expenses") as UntypedFormArray;
  }

  removeExpenseAt(index: number): void {
    this.getExpenses().removeAt(index);
  }

  addExpense(expense?: Expense): void {
    this.getExpenses().push(this.createExpense(expense));
  }

  createExpense(expense?: Expense): UntypedFormGroup {
    if (expense !== undefined) {
      return new UntypedFormGroup({
        id: new UntypedFormControl(expense.id),
        amount: new UntypedFormControl(expense.amount),
        name: new UntypedFormControl(expense.name),
      });
    } else {
      return new UntypedFormGroup({
        id: new UntypedFormControl(0),
        amount: new UntypedFormControl(0),
        name: new UntypedFormControl(""),
      });
    }
  }

  getWoodLists(): UntypedFormArray {
    return this.recalculationGroup.get("wood_lists") as UntypedFormArray;
  }

  removeWoodListAt(index: number): void {
    this.getWoodLists().removeAt(index);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  addWoodList(wood_list?: WoodList): void {
    this.getWoodLists().push(this.createWoodList(wood_list));
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  createWoodList(wood_list?: WoodList): UntypedFormGroup {
    if (wood_list !== undefined) {
      return new UntypedFormGroup({
        id: new UntypedFormControl(wood_list.id),
        price: new UntypedFormControl(wood_list.price),
        name: new UntypedFormControl(wood_list.name),
      });
    } else {
      return new UntypedFormGroup({
        id: new UntypedFormControl(0),
        price: new UntypedFormControl(0),
        name: new UntypedFormControl(""),
      });
    }
  }

  getPaints(): UntypedFormArray {
    return this.recalculationGroup.get("paints") as UntypedFormArray;
  }

  removePaintAt(index: number): void {
    this.getPaints().removeAt(index);
  }

  addPaint(paint?: Paint): void {
    this.getPaints().push(this.createPaint(paint));
  }

  createPaint(paint?: Paint): UntypedFormGroup {
    if (paint !== undefined) {
      return new UntypedFormGroup({
        id: new UntypedFormControl(paint.id),
        amount: new UntypedFormControl(paint.amount),
        name: new UntypedFormControl(paint.name),
        price: new UntypedFormControl(paint.price),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: new UntypedFormControl(paint.unit.id),
      });
    } else {
      return new UntypedFormGroup({
        id: new UntypedFormControl(0),
        amount: new UntypedFormControl(0),
        name: new UntypedFormControl(""),
        price: new UntypedFormControl(0),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: new UntypedFormControl(4),
      });
    }
  }

  onSubmit() {
    const expenses: ExpenseCreate[] = [];
    for (const expenseGroup of this.getExpenses().controls) {
      expenses.push({
        name: expenseGroup.get("name").value,
        amount: expenseGroup.get("amount").value,
      });
    }
    const paints: PaintCreate[] = [];
    for (const paintGroup of this.getPaints().controls) {
      paints.push({
        name: paintGroup.get("name").value,
        price: paintGroup.get("price").value,
        amount: paintGroup.get("amount").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        unit_id: paintGroup.get("unit_id").value,
      });
    }
    const woodLists: WoodListCreate[] = [];
    for (const woodListGroup of this.getWoodLists().controls) {
      woodLists.push({
        name: woodListGroup.get("name").value,
        price: woodListGroup.get("price").value,
      });
    }
    if (this.createMode) {
      const recalculationCreate: RecalculationCreate = {
        expenses,
        paints,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wood_lists: woodLists,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_charge_percent: this.recalculationGroup.get(
          "material_charge_percent",
        ).value,
        km: this.recalculationGroup.get("km").value,
        cost: this.recalculationGroup.get("cost").value,
      };
      this.api
        .createRecalculationRecalculationJobIdPost(
          this.jobId,
          recalculationCreate,
        )
        .pipe(first())
        .subscribe((recalculation) => {
          this.file.open(recalculation.pdf);
          this.router.navigateByUrl("recalculation/" + this.jobId, {
            replaceUrl: true,
          });
        });
    } else {
      const recalculationUpdate: RecalculationUpdate = {
        expenses,
        paints,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wood_lists: woodLists,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_charge_percent: this.recalculationGroup.get(
          "material_charge_percent",
        ).value,
        km: this.recalculationGroup.get("km").value,
        cost: this.recalculationGroup.get("cost").value,
      };
      this.api
        .updateRecalculationRecalculationJobIdPut(
          this.jobId,
          recalculationUpdate,
        )
        .pipe(first())
        .subscribe((recalculation) => {
          this.file.open(recalculation.pdf);
          this.router.navigateByUrl("recalculation/" + this.jobId, {
            replaceUrl: true,
          });
        });
    }
  }

  templatePaintClicked(templatePaint: TemplatePaint) {
    const paint: Paint = {
      name: templatePaint.name,
      amount: 0,
      price: templatePaint.price,
      id: -1,
      unit: templatePaint.unit,
    };
    this.addPaint(paint);
  }

  private initOrderTable() {
    this.orderDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readOrdersToOrderToOrderableToIdGet(
          this.jobId,
          skip,
          limit,
          filter,
        ),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "order_to.displayable_name": dataSource.order_to.displayable_name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              "order_from.displayable_name":
              dataSource.order_from.displayable_name,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              create_date: dayjs(dataSource.create_date).format("L"),
              // eslint-disable-next-line @typescript-eslint/naming-convention
              delivery_date:
                dataSource.delivery_date === null
                  ? ""
                  : dayjs(dataSource.delivery_date).format("L"),
              status: dataSource.status_translation,
            },
            route: () => {
              if (this.recalculationGroup.pristine) {
                this.router.navigateByUrl("/order/" + dataSource.id.toString());
              } else {
                const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                  width: "400px",
                  data: {
                    title: "Nachkalkulation verlassen?",
                    text: "Nicht gespeicherte Änderungen gehen eventuell verloren!",
                  },
                });
                dialogRef.afterClosed().subscribe((result) => {
                  if (result) {
                    this.router.navigateByUrl(
                      "/order/" + dataSource.id.toString(),
                    );
                  }
                });
              }
            },
          });
        });
        return rows;
      },
      [
        { name: "order_to.displayable_name", headerName: "Ziel" },
        { name: "order_from.displayable_name", headerName: "Herkunft" },
        { name: "create_date", headerName: "Erstelldatum" },
        { name: "delivery_date", headerName: "Lieferdatum" },
        { name: "status", headerName: "Status" },
      ],
      (api) => api.readOrdersToCountOrderToOrderableToIdCountGet(this.jobId),
    );
    this.orderDataSource.loadData();
  }

  private initWorkloadTable() {
    this.workloadDataSource = new TableDataSource(
      this.api,
      (api, filter, sortDirection, skip, limit) =>
        api.readWorkloadsWorkloadGet(
          skip,
          limit,
          filter,
          undefined,
          this.jobId,
        ),
      (dataSourceClasses) => {
        const rows = [];
        dataSourceClasses.forEach((dataSource) => {
          rows.push({
            values: {
              "user.fullname": dataSource.user.fullname,
              minutes: minutesToDisplayableString(dataSource.minutes),
              cost: dataSource.cost,
            },
            route: () => {
              //this.router.navigateByUrl('/order/' + dataSource.id.toString());
            },
          });
        });
        return rows;
      },
      [
        { name: "user.fullname", headerName: "Name" },
        { name: "minutes", headerName: "Zeit" },
        { name: "cost", headerName: "Kosten [€]" },
      ],
      (api) => api.readWorkloadCountWorkloadCountGet(undefined, this.jobId),
    );
    this.workloadDataSource.loadData();
  }
}

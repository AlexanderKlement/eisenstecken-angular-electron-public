import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {BaseEditComponent} from '../../shared/components/base-edit/base-edit.component';
import {
    DefaultService,
    Expense, ExpenseCreate,
    Lock, Order, Paint, PaintCreate,
    Recalculation,
    RecalculationCreate, RecalculationUpdate, TemplatePaint, Unit, WoodList, WoodListCreate, Workload
} from 'eisenstecken-openapi-angular-library';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';
import {TableDataSource} from '../../shared/components/table-builder/table-builder.datasource';
import * as moment from 'moment';
import {minutesToDisplayableString} from '../../shared/date.util';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {FileService} from '../../shared/services/file.service';
import {NavigationService} from '../../shared/services/navigation.service';

@Component({
    selector: 'app-recalculation-edit',
    templateUrl: './recalculation-edit.component.html',
    styleUrls: ['./recalculation-edit.component.scss']
})
export class RecalculationEditComponent extends BaseEditComponent<Recalculation> implements OnInit, OnDestroy {
    recalculationGroup: FormGroup;
    navigationTarget = 'recalculation';
    jobId: number;
    jobName$: Observable<string>;
    units$: Observable<Unit[]>;
    templatePaints$: Observable<TemplatePaint[]>;

    orderDataSource: TableDataSource<Order>;
    workloadDataSource: TableDataSource<Workload>;
    title = 'Nachkalkulation: Bearbeiten';

    constructor(api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog, private file: FileService, private navigation: NavigationService) {
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
                console.error('RecalculationEdit: Cannot parse job id');
                this.router.navigateByUrl(this.navigationTarget);
            }
            this.initOrderTable();
            this.initWorkloadTable();
            this.jobName$ = this.api.readJobJobJobIdGet(this.jobId).pipe(
                first(),
                map(job => job.displayable_name)
            );
            if (!this.createMode) {
                this.api.readRecalculationRecalculationRecalculationIdGet(this.id).pipe(first()).subscribe(recalculation => {
                    this.fillFormGroup(recalculation);
                    this.addAtLeastOne();
                });
            } else {
                this.api.getParameterParameterKeyGet('cost_per_km').pipe(first()).subscribe((cost) => {
                    this.recalculationGroup.get('cost').setValue(cost);
                });
                this.api.readDriveDistanceByJobJourneyDistanceJobIdGet(this.jobId).pipe(first()).subscribe((km) => {
                    this.recalculationGroup.get('km').setValue(km);
                });
                this.addAtLeastOne();
            }
        });
        if (this.createMode) {
            this.title = 'Nachkalkulation: Erstellen';
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
        this.recalculationGroup = new FormGroup({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expenses: new FormArray([]),
            paints: new FormArray([]),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            wood_lists: new FormArray([]),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            material_charge_percent: new FormControl(30, Validators.compose([Validators.min(0), Validators.max(100)])),
            km: new FormControl(0.0),
            cost: new FormControl(0.0)
        });
        this.api.getParameterParameterKeyGet('recalculation_percent').pipe(first()).subscribe((paramter) => {
            this.recalculationGroup.get('material_charge_percent').setValue(parseFloat(paramter));
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
        this.recalculationGroup.get('km').setValue(recalculation.km);
        this.recalculationGroup.get('cost').setValue(recalculation.cost);
        this.recalculationGroup.get('material_charge_percent').setValue(recalculation.material_charge_percent);
    }

    getExpenses(): FormArray {
        return this.recalculationGroup.get('expenses') as FormArray;
    }

    removeExpenseAt(index: number): void {
        this.getExpenses().removeAt(index);
    }

    addExpense(expense?: Expense): void {
        this.getExpenses().push(this.createExpense(expense));
    }

    createExpense(expense?: Expense): FormGroup {
        if (expense !== undefined) {
            return new FormGroup({
                id: new FormControl(expense.id),
                amount: new FormControl(expense.amount),
                name: new FormControl(expense.name)
            });
        } else {
            return new FormGroup({
                id: new FormControl(0),
                amount: new FormControl(0),
                name: new FormControl('')
            });
        }
    }

    getWoodLists(): FormArray {
        return this.recalculationGroup.get('wood_lists') as FormArray;
    }

    removeWoodListAt(index: number): void {
        this.getWoodLists().removeAt(index);
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    addWoodList(wood_list?: WoodList): void {
        this.getWoodLists().push(this.createWoodList(wood_list));
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    createWoodList(wood_list?: WoodList): FormGroup {
        if (wood_list !== undefined) {
            return new FormGroup({
                id: new FormControl(wood_list.id),
                price: new FormControl(wood_list.price),
                name: new FormControl(wood_list.name)
            });
        } else {
            return new FormGroup({
                id: new FormControl(0),
                price: new FormControl(0),
                name: new FormControl('')
            });
        }
    }

    getPaints(): FormArray {
        return this.recalculationGroup.get('paints') as FormArray;
    }

    removePaintAt(index: number): void {
        this.getPaints().removeAt(index);
    }

    addPaint(paint?: Paint): void {
        this.getPaints().push(this.createPaint(paint));
    }

    createPaint(paint?: Paint): FormGroup {
        if (paint !== undefined) {
            return new FormGroup({
                id: new FormControl(paint.id),
                amount: new FormControl(paint.amount),
                name: new FormControl(paint.name),
                price: new FormControl(paint.price),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: new FormControl(paint.unit.id)
            });
        } else {
            return new FormGroup({
                id: new FormControl(0),
                amount: new FormControl(0),
                name: new FormControl(''),
                price: new FormControl(0),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: new FormControl(4),
            });
        }
    }


    onSubmit() {
        const expenses: ExpenseCreate[] = [];
        for (const expenseGroup of this.getExpenses().controls) {
            expenses.push({
                name: expenseGroup.get('name').value,
                amount: expenseGroup.get('amount').value,
            });
        }
        const paints: PaintCreate[] = [];
        for (const paintGroup of this.getPaints().controls) {
            paints.push({
                name: paintGroup.get('name').value,
                price: paintGroup.get('price').value,
                amount: paintGroup.get('amount').value,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                unit_id: paintGroup.get('unit_id').value,
            });
        }
        const woodLists: WoodListCreate[] = [];
        for (const woodListGroup of this.getWoodLists().controls) {
            woodLists.push({
                name: woodListGroup.get('name').value,
                price: woodListGroup.get('price').value,
            });
        }
        if (this.createMode) {
            const recalculationCreate: RecalculationCreate = {
                expenses,
                paints,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                wood_lists: woodLists,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                material_charge_percent: this.recalculationGroup.get('material_charge_percent').value,
                km: this.recalculationGroup.get('km').value,
                cost: this.recalculationGroup.get('cost').value
            };
            this.api.createRecalculationRecalculationJobIdPost(this.jobId, recalculationCreate).pipe(first()).subscribe(recalculation => {
                this.file.open(recalculation.pdf);
                this.navigation.removeLastUrl();
                this.router.navigateByUrl('recalculation/' + this.jobId, {replaceUrl: true});
            });
        } else {
            const recalculationUpdate: RecalculationUpdate = {
                expenses,
                paints,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                wood_lists: woodLists,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                material_charge_percent: this.recalculationGroup.get('material_charge_percent').value,
                km: this.recalculationGroup.get('km').value,
                cost: this.recalculationGroup.get('cost').value
            };
            this.api.updateRecalculationRecalculationJobIdPut(this.jobId, recalculationUpdate).pipe(first()).subscribe(recalculation => {
                this.file.open(recalculation.pdf);
                this.navigation.removeLastUrl();
                this.router.navigateByUrl('recalculation/' + this.jobId, {replaceUrl: true});
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
                api.readOrdersToOrderToOrderableToIdGet(this.jobId, skip, limit, filter),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'order_to.displayable_name': dataSource.order_to.displayable_name,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                'order_from.displayable_name': dataSource.order_from.displayable_name,
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                create_date: moment(dataSource.create_date).format('L'),
                                // eslint-disable-next-line @typescript-eslint/naming-convention
                                delivery_date: dataSource.delivery_date === null ? '' : moment(dataSource.delivery_date).format('L'),
                                status: dataSource.status_translation,
                            },
                            route: () => {
                                if (this.recalculationGroup.pristine) {
                                    this.router.navigateByUrl('/order/' + dataSource.id.toString());
                                } else {
                                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                                        width: '400px',
                                        data: {
                                            title: 'Nachkalkulation verlassen?',
                                            text: 'Nicht gespeicherte Änderungen gehen eventuell verloren!'
                                        }
                                    });
                                    dialogRef.afterClosed().subscribe(result => {
                                        if (result) {
                                            this.router.navigateByUrl('/order/' + dataSource.id.toString());
                                        }
                                    });
                                }
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'order_to.displayable_name', headerName: 'Ziel'},
                {name: 'order_from.displayable_name', headerName: 'Herkunft'},
                {name: 'create_date', headerName: 'Erstelldatum'},
                {name: 'delivery_date', headerName: 'Lieferdatum'},
                {name: 'status', headerName: 'Status'},
            ],
            (api) => api.readOrdersToCountOrderToOrderableToIdCountGet(this.jobId)
        );
        this.orderDataSource.loadData();
    }

    private initWorkloadTable() {
        this.workloadDataSource = new TableDataSource(
            this.api,
            (api, filter, sortDirection, skip, limit) =>
                api.readWorkloadsWorkloadGet(skip, limit, filter, undefined, this.jobId),
            (dataSourceClasses) => {
                const rows = [];
                dataSourceClasses.forEach((dataSource) => {
                    rows.push(
                        {
                            values: {
                                'user.fullname': dataSource.user.fullname,
                                minutes: minutesToDisplayableString(dataSource.minutes),
                                cost: dataSource.cost,
                            },
                            route: () => {
                                //this.router.navigateByUrl('/order/' + dataSource.id.toString());
                            }
                        });
                });
                return rows;
            },
            [
                {name: 'user.fullname', headerName: 'Name'},
                {name: 'minutes', headerName: 'Zeit'},
                {name: 'cost', headerName: 'Kosten [€]'},
            ],
            (api) => api.readWorkloadCountWorkloadCountGet(undefined, this.jobId)
        );
        this.workloadDataSource.loadData();
    }
}

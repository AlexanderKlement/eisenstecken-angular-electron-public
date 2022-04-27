import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomButton} from '../../../shared/components/toolbar/toolbar.component';
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators
} from '@angular/forms';
import {Observable} from 'rxjs';
import {
    AdditionalWorkloadCreate,
    Car,
    DefaultService,
    Drive,
    DriveCreate,
    EatingPlace,
    Expense,
    ExpenseCreate,
    Job,
    JobSectionCreate,
    UserEssential,
    WorkDay,
    WorkDayCreate
} from 'eisenstecken-openapi-angular-library';
import {AuthService} from '../../../shared/services/auth.service';
import {first} from 'rxjs/operators';
import {Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';

function jobGroupValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (parseInt(control.get('spendableMinutes').value, 10) === 0) {
            return null;
        }
        return {minutesNotSpend: {value: control.get('spendableMinutes').value}};
    };
}

function greaterThanValidator(value: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (parseInt(control.value, 10) <= value) {
            return {enoughHours: false};
        }
        return null;
    };
}


@Component({
    selector: 'app-hours-stepper',
    templateUrl: './hours-stepper.component.html',
    styleUrls: ['./hours-stepper.component.scss']
})
export class HoursStepperComponent implements OnInit {

    @Input() workDay: WorkDay = undefined;
    @Input() userId: number = undefined;
    @Input() backStepper$: Observable<void> = undefined;
    @Output() firstSiteGoBack = new EventEmitter();
    user: UserEssential;
    buttons: CustomButton[] = [];
    hourFormGroup: FormGroup;
    jobFormGroup: FormGroup;
    mealFormGroup: FormGroup;
    expensesJourneyGroup: FormGroup;
    eatingPlaces$: Observable<EatingPlace[]>;
    jobs$: Observable<Job[]>;
    cars$: Observable<Car[]>;
    jobsLoaded = false;
    availableHoursString = '';
    @ViewChild('stepper') private stepper: MatStepper;

    constructor(private api: DefaultService, private authService: AuthService, private router: Router) {
    }

    static generateHourString(hours: number, minutes: number): string {
        let workedHoursString = hours.toString();
        workedHoursString += ' ';
        workedHoursString += (hours === 1) ? 'Stunde' : 'Stunden';
        workedHoursString += ' ';
        workedHoursString += minutes.toString();
        workedHoursString += ' ';
        workedHoursString += (minutes === 1) ? 'Minute' : 'Minuten';
        return workedHoursString;
    }

    ngOnInit(): void {
        if (this.userId === undefined) {
            this.authService.getCurrentUser().pipe(first()).subscribe((user) => {
                this.user = user;
            });
        } else {
            this.api.readUserUsersUserIdGet(this.userId).pipe(first()).subscribe((user) => {
                this.user = user;
            });
        }
        this.initFormGroups();
        this.getData();
        this.refreshShownHoursMinutes();
    }

    stepBackStepBro() {
        this.stepper.previous();
    }


    addTotalMinutes(minutesToAdd: number): void {
        const actualMinutes = parseInt(this.hourFormGroup.get('minutes').value, 10);
        this.hourFormGroup.get('minutes').setValue(actualMinutes + minutesToAdd);
        this.refreshShownHoursMinutes();
        this.refreshSpentMinutes();
    }

    getWorkedHoursString(): string {
        const hours = parseInt(this.hourFormGroup.get('showingHours').value, 10);
        const minutes = parseInt(this.hourFormGroup.get('showingMinutes').value, 10);
        return HoursStepperComponent.generateHourString(hours, minutes);
    }

    getAvailableHoursString(): string {
        const spendableMinutes = parseInt(this.jobFormGroup.get('spendableMinutes').value, 10);
        const hours = Math.floor(spendableMinutes / 60);
        const minutes = spendableMinutes % 60;
        return HoursStepperComponent.generateHourString(hours, minutes);
    }

    getJobs(): FormArray {
        return this.jobFormGroup.get('jobs') as FormArray;
    }

    addMinutesToJob(minutesToAdd: number, index: number, direction: boolean) {
        const fieldName = direction ? 'minutesDirection' : 'minutes';
        const actualMinutes = parseInt(this.getJobs().at(index).get(fieldName).value, 10);
        this.getJobs().at(index).get(fieldName).setValue(actualMinutes + minutesToAdd);
        this.refreshSpentMinutes();
    }


    getMinutesFromJob(index: number, direction: boolean): string {
        const fieldName = direction ? 'minutesDirection' : 'minutes';
        const minutes = parseInt(this.getJobs().at(index).get(fieldName).value, 10);
        return HoursStepperComponent.generateHourString(Math.floor(minutes / 60), minutes % 60);
    }

    getNameFromJob(i: number): string {
        return this.getJobs().at(i).get('name').value;
    }

    initExpense(expense?: Expense): FormGroup {
        if (expense === undefined) {
            return new FormGroup({
                name: new FormControl(''),
                amount: new FormControl('')
            });
        } else {
            return new FormGroup({
                name: new FormControl(expense.name),
                amount: new FormControl(expense.amount)
            });
        }
    }

    initDrive(drive?: Drive): FormGroup {
        if (drive === undefined) {
            return new FormGroup({
                km: new FormControl(0.0),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                car_id: new FormControl(1)
            });
        } else {
            return new FormGroup({
                km: new FormControl(drive.km),
                // eslint-disable-next-line @typescript-eslint/naming-convention
                car_id: new FormControl(drive.id)
            });
        }
    }

    getDrives(): FormArray {
        return this.expensesJourneyGroup.get('drives') as FormArray;
    }

    getExpenses(): FormArray {
        return this.expensesJourneyGroup.get('expenses') as FormArray;
    }

    onRemoveDriveClick(i: number): void {
        this.getDrives().removeAt(i);
    }

    onAddCarClick(): void {
        this.getDrives().push(this.initDrive());
    }

    onRemoveExpenseClick(index: number): void {
        this.getExpenses().removeAt(index);
    }

    onAddExpenseClick(): void {
        this.getExpenses().push(this.initExpense());
    }


    submitClicked() {
        const workDayCreate = this.createWorkDayCreate();
        this.api.createWorkDayWorkDayOwnPost(workDayCreate).pipe(first()).subscribe(() => {
            this.router.navigateByUrl('/mobile/hours/redirect', {replaceUrl: true});
            //window.location.reload();
        });
    }

    createWorkDayCreate(): WorkDayCreate {
        const jobSectionsCreates: JobSectionCreate[] = [];
        for (const jobSection of this.getJobs().controls) {
            if (parseInt(jobSection.get('minutes').value, 10) > 0 || parseInt(jobSection.get('minutesDirection').value, 10) > 0) {
                jobSectionsCreates.push({
                    minutes: parseInt(jobSection.get('minutes').value, 10),
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    minutes_direction: parseInt(jobSection.get('minutesDirection').value, 10),
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    job_id: jobSection.get('jobId').value,
                });
            }
        }

        const expensesCreates: ExpenseCreate[] = [];
        for (const expense of this.getExpenses().controls) {
            if (parseFloat(expense.get('amount').value) > 0) {
                expensesCreates.push({
                    name: expense.get('name').value,
                    amount: parseFloat(expense.get('amount').value)
                });
            }
        }

        const driveCreates: DriveCreate[] = [];
        for (const drive of this.getDrives().controls) {
            if (parseFloat(drive.get('km').value) > 0) {
                driveCreates.push({
                    km: parseFloat(drive.get('km').value),
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    car_id: parseInt(drive.get('car_id').value, 10)
                });
            }
        }

        const additionalWorkloadCreates: AdditionalWorkloadCreate[] = [];

        return {
            minutes: parseInt(this.hourFormGroup.get('minutes').value, 10),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            job_sections: jobSectionsCreates,
            expenses: expensesCreates,
            drives: driveCreates,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            eating_place_id: parseInt(this.mealFormGroup.get('eatingPlaceId').value, 10),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            additional_workloads: additionalWorkloadCreates
        };
    }

    jobsNextClicked() {
        if (parseInt(this.jobFormGroup.get('spendableMinutes').value, 10) === 0) {
            this.stepper.next();
        }
    }

    mealNextClicked() {
        if (parseInt(this.mealFormGroup.get('eatingPlaceId').value, 10) > 0) {
            this.stepper.next();
        }
    }

    private initFormGroups() {
        this.hourFormGroup = new FormGroup({
            minutes: new FormControl(0, [greaterThanValidator(0)]),
            showingHours: new FormControl(0),
            showingMinutes: new FormControl(0),
        });
        this.jobFormGroup = new FormGroup({
            spendableMinutes: new FormControl(0),
            jobs: new FormArray([]),
        }, [jobGroupValidator]);
        this.mealFormGroup = new FormGroup({
            eatingPlaceId: new FormControl(0, [Validators.required]),
        });
        this.expensesJourneyGroup = new FormGroup({
            expenses: new FormArray([]),
            drives: new FormArray([]),
        });
    }

    private refreshShownHoursMinutes(): void {
        const actualMinutes = parseInt(this.hourFormGroup.get('minutes').value, 10);
        this.hourFormGroup.get('showingHours').setValue(Math.floor(actualMinutes / 60));
        this.hourFormGroup.get('showingMinutes').setValue(actualMinutes % 60);
    }

    private refreshSpentMinutes(): void {
        let spendMinutes = 0;
        for (const job of this.getJobs().controls) {
            spendMinutes += parseInt(job.get('minutes').value, 10);
            spendMinutes += parseInt(job.get('minutesDirection').value, 10);
        }
        const spendableMinutes = parseInt(this.hourFormGroup.get('minutes').value, 10) - spendMinutes;
        this.jobFormGroup.get('spendableMinutes').setValue(spendableMinutes);
        this.availableHoursString = this.getAvailableHoursString();
    }

    private initJobs(): void {
        this.jobs$.pipe(first()).subscribe((jobs) => {
            for (const job of jobs) {
                this.getJobs().push(this.initSingleJob(0, 0, job));
            }
            this.jobsLoaded = true;
        });
    }

    private initSingleJob(minutes: number, minutesDirection: number, job: Job): FormGroup {
        const name = job.code + ' ' + job.client.fullname;
        return new FormGroup({
            minutes: new FormControl(minutes),
            minutesDirection: new FormControl(minutesDirection),
            jobId: new FormControl(job.id),
            name: new FormControl(name),
            job: new FormControl(job)
        });
    }

    private getData() {
        this.authService.getCurrentUser().pipe(first()).subscribe((currentUser) => {
            if (currentUser.office) {
                this.jobs$ = this.api.readJobsJobGet(0, 200, '', undefined, 'JOBSTATUS_ACCEPTED, JOBSTATUS_CREATED', true);
            } else {
                this.jobs$ = this.api.readJobsJobGet(0, 200, '', undefined, 'JOBSTATUS_ACCEPTED', true);
            }
            this.initJobs();
        });
        this.cars$ = this.api.getCarsCarGet();
        this.eatingPlaces$ = this.api.getEatingPlacesEatingPlaceGet();
    }
}

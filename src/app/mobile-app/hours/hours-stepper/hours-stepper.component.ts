import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {Observable, Subscriber} from 'rxjs';
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
import {MatStepper, StepperOrientation} from '@angular/material/stepper';


function greaterThanValidator(value: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (parseInt(control.value, 10) <= value) {
            return {enoughHours: false};
        }
        return null;
    };
}

export enum JobEnum {
    accepted,
    created
}


@Component({
    selector: 'app-hours-stepper',
    templateUrl: './hours-stepper.component.html',
    styleUrls: ['./hours-stepper.component.scss']
})
export class HoursStepperComponent implements OnInit {

    @Input() workDay: WorkDay;
    @Input() userId: number = undefined;
    @Input() backStepper$: Observable<void> = undefined;
    @Input() showOnlySummary = false;
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
    stepperOrientation: StepperOrientation = 'horizontal';
    jobsReady$: Observable<void>;
    jobsReadySubscriber$: Subscriber<void>;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('stepper') private stepper: MatStepper;

    constructor(private api: DefaultService, private authService: AuthService, private router: Router) {
    }

    static generateHourString(hours: number, minutes: number, mobile: boolean = false): string {
        let workedHoursString = (mobile ? '<br />' : '') + hours.toString();
        workedHoursString += ' ';
        workedHoursString += (hours === 1) ? 'Stunde' : 'Stunden';
        workedHoursString += (mobile ? '<br />' : ' ');
        workedHoursString += minutes.toString();
        workedHoursString += ' ';
        workedHoursString += (minutes === 1) ? 'Minute' : 'Minuten';
        return workedHoursString;
    }

    private static initSingleJob(minutes: number, minutesDirection: number, job: Job): FormGroup {
        const name = job.code + ' ' + job.client.fullname;
        return new FormGroup({
            minutes: new FormControl(minutes),
            minutesDirection: new FormControl(minutesDirection),
            jobId: new FormControl(job.id),
            name: new FormControl(name),
            job: new FormControl(job)
        });
    }

    ngOnInit(): void {
        if (window.innerWidth < 600) {
            this.stepperOrientation = 'vertical';
        }
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
        if (this.workDay) {
            this.fillData();
        }
        this.refreshShownHoursMinutes();
        this.refreshSpentMinutes();
        this.jobsReady$ = new Observable<void>((subscriber) => {
            this.jobsReadySubscriber$ = subscriber;
        });
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

    getJobs(jobEnum: JobEnum): FormArray {
        switch (jobEnum) {
            case JobEnum.accepted:
                return this.jobFormGroup.get('jobsAccepted') as FormArray;
            case JobEnum.created:
                return this.jobFormGroup.get('jobsCreated') as FormArray;
        }
    }

    addMinutesToJob(minutesToAdd: number, index: number, direction: boolean, jobEnum: JobEnum) {
        const fieldName = direction ? 'minutesDirection' : 'minutes';
        const actualMinutes = parseInt(this.getJobs(jobEnum).at(index).get(fieldName).value, 10);
        if ((actualMinutes + minutesToAdd) < 0) {
            return;
        }
        this.getJobs(jobEnum).at(index).get(fieldName).setValue(actualMinutes + minutesToAdd);
        this.refreshSpentMinutes();
    }

    getAllJobs(): FormArray[] {
        return [
            this.getJobs(JobEnum.accepted),
            this.getJobs(JobEnum.created)
        ];
    }

    getMinutesFromJob(index: number, direction: boolean, jobEnum: JobEnum): string {
        const fieldName = direction ? 'minutesDirection' : 'minutes';
        const minutes = parseInt(this.getJobs(jobEnum).at(index).get(fieldName).value, 10);
        // eslint-disable-next-line max-len
        return HoursStepperComponent.generateHourString(Math.floor(minutes / 60), minutes % 60);
    }

    getNameFromJob(i: number, jobEnum: JobEnum): string {
        return this.getJobs(jobEnum).at(i).get('name').value;
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
                car_id: new FormControl(drive.car.id)
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
        });
    }

    createWorkDayCreate(): WorkDayCreate {
        const jobSectionsCreates: JobSectionCreate[] = [];
        for (const jobSectionLists of this.getAllJobs()) {
            for (const jobSection of jobSectionLists.controls) {
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
        }

        const minutesMaintenance = parseInt(this.jobFormGroup.get('maintenanceMinutes').value, 10);

        if (minutesMaintenance > 0) {
            jobSectionsCreates.push({
                minutes: minutesMaintenance,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                minutes_direction: 0,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                job_id: 0
            });

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
        if (parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10) > 0) {
            additionalWorkloadCreates.push({
                minutes: parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10),
                description: this.jobFormGroup.get('additionalJob').get('description').value
            });
        }

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
            this.jobsReadySubscriber$.next();
            this.stepper.next();
        }
    }

    addMinutesToAdditionalJob(addMinutes: number) {
        const minutes = parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10);
        if ((addMinutes + minutes) < 0) {
            return;
        }
        this.jobFormGroup.get('additionalJob').get('minutes').setValue(minutes + addMinutes);
        this.refreshSpentMinutes();
    }

    getMinutesFromAddtionalJob(): string {
        const minutes = parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10);
        return HoursStepperComponent.generateHourString(Math.floor(minutes / 60), minutes % 60);
    }

    getMinutesFromMaintenance(): string {
        const minutes = parseInt(this.jobFormGroup.get('maintenanceMinutes').value, 10);
        return HoursStepperComponent.generateHourString(Math.floor(minutes / 60), minutes % 60);
    }

    addMinutesToMaintenance(newMinutes: number): void {
        const minutes = parseInt(this.jobFormGroup.get('maintenanceMinutes').value, 10);
        if (minutes + newMinutes < 0) {
            return;
        }
        this.jobFormGroup.get('maintenanceMinutes').setValue(minutes + newMinutes);
        this.refreshSpentMinutes();
    }

    getJobListName(jobEnum: JobEnum) {
        switch (jobEnum) {
            case JobEnum.accepted:
                return 'Angenommen';
            case JobEnum.created:
                return 'Erstellt';
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
            maintenanceMinutes: new FormControl(0),
            jobsAccepted: new FormArray([]),
            jobsCreated: new FormArray([]),
            additionalJob: new FormGroup({
                minutes: new FormControl(0),
                description: new FormControl('')
            }),
        });
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
        for (const jobList of this.getAllJobs()) {
            for (const job of jobList.controls) {
                spendMinutes += parseInt(job.get('minutes').value, 10);
                spendMinutes += parseInt(job.get('minutesDirection').value, 10);
            }
        }
        spendMinutes += parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10);
        spendMinutes += parseInt(this.jobFormGroup.get('maintenanceMinutes').value, 10);

        const spendableMinutes = parseInt(this.hourFormGroup.get('minutes').value, 10) - spendMinutes;
        this.jobFormGroup.get('spendableMinutes').setValue(spendableMinutes);
        this.availableHoursString = this.getAvailableHoursString();
    }

    private initJobs(): void {
        this.jobs$.pipe(first()).subscribe((jobs) => {
            for (const job of jobs) {
                if (job.status.status === 'JOBSTATUS_ACCEPTED') {
                    this.getJobs(JobEnum.accepted).push(HoursStepperComponent.initSingleJob(0, 0, job));
                }
                if (job.status.status === 'JOBSTATUS_CREATED') {
                    this.getJobs(JobEnum.created).push(HoursStepperComponent.initSingleJob(0, 0, job));
                }
            }
            this.jobsLoaded = true;
            if (this.workDay) {
                this.fillDataJobs();
            }
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

    private fillData() {
        this.hourFormGroup.get('minutes').setValue(this.workDay.minutes);

        this.mealFormGroup.get('eatingPlaceId').setValue([this.workDay.eating_place.id]);

        if (this.workDay.additional_workloads.length > 0) {
            const additionalJobGroup = this.jobFormGroup.get('additionalJob');
            additionalJobGroup.get('minutes').setValue(this.workDay.additional_workloads[0].minutes);
            additionalJobGroup.get('description').setValue(this.workDay.additional_workloads[0].description);
        }


        for (const expense of this.workDay.expenses) {
            this.getExpenses().push(this.initExpense(expense));
        }

        for (const drive of this.workDay.drives) {
            this.getDrives().push(this.initDrive(drive));
        }

    }

    private fillDataJobs() {
        for (const jobControlList of this.getAllJobs()) {
            for (const jobControl of jobControlList.controls) {
                for (const jobSection of this.workDay.job_sections) {
                    if (!jobSection.job) {
                        this.jobFormGroup.get('maintenanceMinutes').setValue(jobSection.minutes);
                        continue;
                    }
                    if (jobSection.job.id === parseInt(jobControl.get('jobId').value, 10)) {
                        jobControl.get('minutes').setValue(jobSection.minutes);
                        jobControl.get('minutesDirection').setValue(jobSection.minutes_direction);
                    }
                }
            }
        }
        this.refreshSpentMinutes();
        this.jobsReadySubscriber$.next();
    }
}

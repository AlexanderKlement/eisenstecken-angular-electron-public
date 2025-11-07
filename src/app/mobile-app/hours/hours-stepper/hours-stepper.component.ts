import {
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CustomButton } from "../../../shared/components/toolbar/toolbar.component";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { Observable, Subject, Subscriber } from "rxjs";
import { AuthService } from "../../../shared/services/auth.service";
import { first } from "rxjs/operators";
import { Router } from "@angular/router";
import { MatStepper, StepperOrientation } from "@angular/material/stepper";
import { MatDialog } from "@angular/material/dialog";
import {
  HoursStepperJobDialogComponent,
  HoursStepperVariantEnum,
} from "./hours-stepper-job-dialog/hours-stepper-job-dialog.component";
import { formatDateTransport } from "../../../shared/date.util";
import {
  HoursStepperDriveDialogComponent,
  HoursStepperDriveDialogData,
} from "./hours-stepper-drive-dialog/hours-stepper-drive-dialog.component";
import {
  DefaultService,
  Expense,
  User,
  WorkDay,
  ExpenseCreate,
  Car,
  Job,
  EatingPlace,
  Drive,
  DriveCreate,
  AdditionalWorkloadCreate,
  JobSectionCreate,
  WorkDayCreate,
} from "../../../../api/openapi";

function greaterThanValidator(value: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (parseInt(control.value, 10) <= value) {
      return { enoughHours: false };
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
  styleUrls: ['./hours-stepper.component.scss'],
  standalone: false,
})
export class HoursStepperComponent implements OnInit {

  @Input() workDay$: Subject<WorkDay>;
  @Input() userId: number = undefined;
  @Input() backStepper$: Subject<void>;
  @Input() showOnlySummary = false;
  @Input() date: Date = undefined;
  workDay: WorkDay;
  user: User;
  buttons: CustomButton[] = [];
  hourFormGroup: UntypedFormGroup;
  jobFormGroup: UntypedFormGroup;
  mealFormGroup: UntypedFormGroup;
  expensesJourneyGroup: UntypedFormGroup;
  eatingPlaces$: Observable<EatingPlace[]>;
  jobs$: Observable<Job[]>;
  cars$: Observable<Car[]>;
  jobsLoaded = false;
  availableHoursString = "";
  stepperOrientation: StepperOrientation = "horizontal";
  jobsReady$: Observable<void>;
  jobsReadySubscriber$: Subscriber<void>;
  mobile = false;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(private api: DefaultService, private dialog: MatDialog,
              private authService: AuthService, private router: Router) {
  }

  static generateHourString(hours: number, minutes: number, mobile = false): string {
    let workedHoursString = (mobile ? "<br />" : "") + hours.toString();
    workedHoursString += " ";
    workedHoursString += (hours === 1) ? "Stunde" : "Stunden";
    workedHoursString += (mobile ? "<br />" : " ");
    workedHoursString += minutes.toString();
    workedHoursString += " ";
    workedHoursString += (minutes === 1) ? "Minute" : "Minuten";
    return workedHoursString;
  }

  private static initSingleJob(minutes: number, minutesDirection: number, job: Job): UntypedFormGroup {
    const name = job.code + " " + job.client.fullname;
    return new UntypedFormGroup({
      minutes: new UntypedFormControl(minutes),
      minutesDirection: new UntypedFormControl(minutesDirection),
      jobId: new UntypedFormControl(job.id),
      name: new UntypedFormControl(name),
      job: new UntypedFormControl(job),
    });
  }

  ngOnInit(): void {
    if (window.innerWidth < 600) {
      this.stepperOrientation = "vertical";
      this.mobile = true;
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
    this.subscribeToWorkday();
    if (this.backStepper$ !== undefined) {
      this.backStepper$.subscribe(() => {
        this.stepper.previous();
        //TODO: add check if first site
      });
    }
    this.jobsReady$ = new Observable<void>((subscriber => {
      this.jobsReadySubscriber$ = subscriber;
    }));
    this.refreshData();
  }

  refreshData(): void {
    this.refreshShownHoursMinutes();
    this.refreshSpentMinutes();
  }

  stepBackStepBro() {
    this.stepper.previous();
  }

  addTotalMinutes(minutesToAdd: number): void {
    const actualMinutes = parseInt(this.hourFormGroup.get("minutes").value, 10);
    this.hourFormGroup.get("minutes").setValue(actualMinutes + minutesToAdd);
    this.refreshShownHoursMinutes();
    this.refreshSpentMinutes();
  }

  getWorkedHoursString(): string {
    const hours = parseInt(this.hourFormGroup.get("showingHours").value, 10);
    const minutes = parseInt(this.hourFormGroup.get("showingMinutes").value, 10);
    return HoursStepperComponent.generateHourString(hours, minutes);
  }

  getAvailableHoursString(): string {
    const spendableMinutes = parseInt(this.jobFormGroup.get("spendableMinutes").value, 10);
    const hours = Math.trunc(spendableMinutes / 60);
    const minutes = spendableMinutes % 60;
    return HoursStepperComponent.generateHourString(hours, minutes);
  }

  getJobs(jobEnum: JobEnum): UntypedFormArray {
    switch (jobEnum) {
      case JobEnum.accepted:
        return this.jobFormGroup.get("jobsAccepted") as UntypedFormArray;
      case JobEnum.created:
        return this.jobFormGroup.get("jobsCreated") as UntypedFormArray;
    }
  }

  addMinutesToJob(minutesToAdd: number, index: number, direction: boolean, jobEnum: JobEnum) {
    const fieldName = direction ? "minutesDirection" : "minutes";
    const actualMinutes = parseInt(this.getJobs(jobEnum).at(index).get(fieldName).value, 10);
    if ((actualMinutes + minutesToAdd) < 0) {
      return;
    }
    this.getJobs(jobEnum).at(index).get(fieldName).setValue(actualMinutes + minutesToAdd);
    this.refreshSpentMinutes();
  }

  getAllJobs(): UntypedFormArray[] {
    return [
      this.getJobs(JobEnum.accepted),
      this.getJobs(JobEnum.created),
    ];
  }

  getMinutesStringFromJob(index: number, direction: boolean, jobEnum: JobEnum): string {
    const fieldName = direction ? "minutesDirection" : "minutes";
    const minutes = parseInt(this.getJobs(jobEnum).at(index).get(fieldName).value, 10);
    // eslint-disable-next-line max-len
    return HoursStepperComponent.generateHourString(Math.trunc(minutes / 60), minutes % 60);
  }

  getNameFromJob(i: number, jobEnum: JobEnum): string {
    return this.getJobs(jobEnum).at(i).get("name").value;
  }

  getIdFromJob(i: number, jobEnum: JobEnum): string {
    return this.getJobs(jobEnum).at(i).get("jobId").value;
  }

  getMinutesFromJob(i: number, jobEnum: JobEnum, direction): number {
    const fieldName = direction ? "minutesDirection" : "minutes";
    return parseInt(this.getJobs(jobEnum).at(i).get(fieldName).value, 10);
  }

  initExpense(expense?: Expense): UntypedFormGroup {
    if (expense === undefined) {
      return new UntypedFormGroup({
        name: new UntypedFormControl(""),
        amount: new UntypedFormControl(""),
      });
    } else {
      return new UntypedFormGroup({
        name: new UntypedFormControl(expense.name),
        amount: new UntypedFormControl(expense.amount),
      });
    }
  }

  initDrive(drive?: Drive, jobId?: number, reasonString?: string): UntypedFormGroup {
    if (drive === undefined) {
      return new UntypedFormGroup({
        km: new UntypedFormControl(0.0),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        car_id: new UntypedFormControl(1),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: new UntypedFormControl(jobId),
        reasonString: new UntypedFormControl(reasonString),
      });
    } else {
      let reason = "";
      // eslint-disable-next-line @typescript-eslint/naming-convention
      let job_id = -1;
      if (drive.reason !== undefined) {
        reason = drive.reason;
      }
      console.log(reason);
      if (drive.job !== undefined) {
        reason = drive.job.code + " " + drive.job.client.fullname;
        job_id = drive.job.id;
      }
      console.log(reason);
      return new UntypedFormGroup({
        km: new UntypedFormControl(drive.km),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: new UntypedFormControl(job_id),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        car_id: new UntypedFormControl(drive.car.id),
        reasonString: new UntypedFormControl(reason),

      });
    }
  }

  getDrives(): UntypedFormArray {
    return this.expensesJourneyGroup.get("drives") as UntypedFormArray;
  }

  getExpenses(): UntypedFormArray {
    return this.expensesJourneyGroup.get("expenses") as UntypedFormArray;
  }

  onRemoveDriveClick(i: number): void {
    this.getDrives().removeAt(i);
  }

  onAddCarClick(): void {
    const jobEnums = [JobEnum.accepted];
    if (this.user.office) {
      jobEnums.push(JobEnum.created);
    }
    const data: HoursStepperDriveDialogData = {
      jobEnums,
      jobFormGroup: this.jobFormGroup,
    };
    const dialogRef = this.dialog.open(HoursStepperDriveDialogComponent, {
      width: "100vw",
      maxWidth: "1400px",
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.reason !== undefined) {
          this.getDrives().push(this.initDrive(undefined, -1, result.reason));
        }
        if (result.jobId !== undefined) {
          this.api.readJobJobJobIdGet(result.jobId).pipe(first()).subscribe((job) => {
            this.getDrives().push(this.initDrive(undefined, result.jobId, job.code + " " + job.client.fullname));
          });
        }
      }
    });
  }

  onRemoveExpenseClick(index: number): void {
    this.getExpenses().removeAt(index);
  }

  onAddExpenseClick(): void {
    this.getExpenses().push(this.initExpense());
  }

  submitClicked() {
    const workDayCreate = this.createWorkDayCreate();
    if (this.date !== undefined && this.userId !== undefined) {
      this.api.createWorkDayWorkDayUserIdPost(this.userId, formatDateTransport(this.date.toDateString()), workDayCreate)
        .pipe(first()).subscribe(() => {
        this.router.navigateByUrl("/employee/redirect/" + this.userId.toString(), { replaceUrl: true });
      });
    } else {
      this.api.createWorkDayOwnWorkDayOwnPost(workDayCreate).pipe(first()).subscribe(() => {
        this.router.navigateByUrl("/mobile/hours/redirect", { replaceUrl: true });
      });
    }
  }

  createWorkDayCreate(): WorkDayCreate {
    const jobSectionsCreates: JobSectionCreate[] = [];
    for (const jobSectionLists of this.getAllJobs()) {
      for (const jobSection of jobSectionLists.controls) {
        if (parseInt(jobSection.get("minutes").value, 10) > 0 || parseInt(jobSection.get("minutesDirection").value, 10) > 0) {
          jobSectionsCreates.push({
            minutes: parseInt(jobSection.get("minutes").value, 10),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            minutes_direction: parseInt(jobSection.get("minutesDirection").value, 10),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            job_id: jobSection.get("jobId").value,
          });
        }
      }
    }

    const minutesMaintenance = parseInt(this.jobFormGroup.get("maintenanceMinutes").value, 10);

    if (minutesMaintenance > 0) {
      jobSectionsCreates.push({
        minutes: minutesMaintenance,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        minutes_direction: 0,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: 0,
      });

    }

    const expensesCreates: ExpenseCreate[] = [];
    for (const expense of this.getExpenses().controls) {
      if (parseFloat(expense.get("amount").value) > 0) {
        expensesCreates.push({
          name: expense.get("name").value,
          amount: parseFloat(expense.get("amount").value),
        });
      }
    }

    const driveCreates: DriveCreate[] = [];
    for (const drive of this.getDrives().controls) {
      if (parseFloat(drive.get("km").value) > 0) {
        const driveCreate: DriveCreate = {
          km: parseFloat(drive.get("km").value),
          // eslint-disable-next-line @typescript-eslint/naming-convention
          car_id: parseInt(drive.get("car_id").value, 10),
        };
        const driveJobId = parseInt(drive.get("job_id").value, 10);
        if (driveJobId > 0) {
          driveCreate.job_id = driveJobId;
        } else {
          driveCreate.reason = drive.get("reason").value;
        }
        driveCreates.push(driveCreate);
      }
    }

    const additionalWorkloadCreates: AdditionalWorkloadCreate[] = [];
    if (parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10) > 0) {
      additionalWorkloadCreates.push({
        minutes: parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10),
        description: this.jobFormGroup.get("additionalJob").get("description").value,
      });
    }

    return {
      minutes: parseInt(this.hourFormGroup.get("minutes").value, 10),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      job_sections: jobSectionsCreates,
      expenses: expensesCreates,
      drives: driveCreates,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      eating_place_id: parseInt(this.mealFormGroup.get("eatingPlaceId").value, 10),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      additional_workloads: additionalWorkloadCreates,
    };
  }

  jobsNextClicked() {
    if (parseInt(this.jobFormGroup.get("spendableMinutes").value, 10) === 0) {
      this.stepper.next();
    }
  }

  mealNextClicked() {
    if (parseInt(this.mealFormGroup.get("eatingPlaceId").value, 10) > 0) {
      //this.jobsReadySubscriber$.next();
      this.stepper.next();
    }
  }

  addMinutesToAdditionalJob(addMinutes: number) {
    const minutes = parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10);
    if ((addMinutes + minutes) < 0) {
      return;
    }
    this.jobFormGroup.get("additionalJob").get("minutes").setValue(minutes + addMinutes);
    this.refreshSpentMinutes();
  }

  getMinutesFromAdditionalJob(): string {
    const minutes = parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10);
    return HoursStepperComponent.generateHourString(Math.trunc(minutes / 60), minutes % 60);
  }

  getNameFromAdditionalJob(): string {
    return this.jobFormGroup.get("additionalJob").get("description").value;
  }

  getMinutesFromMaintenance(): string {
    const minutes = parseInt(this.jobFormGroup.get("maintenanceMinutes").value, 10);
    return HoursStepperComponent.generateHourString(Math.trunc(minutes / 60), minutes % 60);
  }

  addMinutesToMaintenance(newMinutes: number): void {
    const minutes = parseInt(this.jobFormGroup.get("maintenanceMinutes").value, 10);
    if (minutes + newMinutes < 0) {
      return;
    }
    this.jobFormGroup.get("maintenanceMinutes").setValue(minutes + newMinutes);
    this.refreshSpentMinutes();
  }

  getJobListName(jobEnum: JobEnum) {
    switch (jobEnum) {
      case JobEnum.accepted:
        return "Angenommen";
      case JobEnum.created:
        return "Erstellt";
    }
  }


  openDialogClicked(variant: HoursStepperVariantEnum, selectedJobIndex?: number, selectedJobList?: number): void {
    const data = {
      jobGroup: this.jobFormGroup,
      additionalJobs: this.jobFormGroup.get("additionalJob") as UntypedFormGroup,
      variant,
      hourFormGroup: this.hourFormGroup,
      selectedJobList: -1,
      selectedJobIndex: -1,
    };
    if (selectedJobIndex !== undefined && selectedJobList !== undefined) {
      data.selectedJobList = selectedJobList;
      data.selectedJobIndex = selectedJobIndex;
    }
    const dialogRef = this.dialog.open(HoursStepperJobDialogComponent, {
      width: "100vw",
      maxWidth: "1400px",
      data,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobFormGroup = result.jobGroup;
        this.jobFormGroup.setControl("additionalJob", result.additionalJobs);
        this.hourFormGroup = result.hourFormGroup;
        this.refreshSpentMinutes();
        this.jobsReadySubscriber$.next();
      }
    });

  }

  showMaintenance(): boolean {
    return parseInt(this.jobFormGroup.get("maintenanceMinutes").value, 10) > 0;
  }

  showAdditionalMinutes() {
    return parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10) > 0;
  }

  showJob(i: number, jobEnum: JobEnum): boolean {
    return parseInt(this.getJobs(jobEnum).at(i).get("minutes").value, 10) > 0;
  }

  private initFormGroups() {
    this.hourFormGroup = new UntypedFormGroup({
      minutes: new UntypedFormControl(0, [greaterThanValidator(0)]),
      showingHours: new UntypedFormControl(0),
      showingMinutes: new UntypedFormControl(0),
    });
    this.jobFormGroup = new UntypedFormGroup({
      spendableMinutes: new UntypedFormControl(0),
      maintenanceMinutes: new UntypedFormControl(0),
      jobsAccepted: new UntypedFormArray([]),
      jobsCreated: new UntypedFormArray([]),
      additionalJob: new UntypedFormGroup({
        minutes: new UntypedFormControl(0),
        description: new UntypedFormControl(""),
      }),
    });
    this.mealFormGroup = new UntypedFormGroup({
      eatingPlaceId: new UntypedFormControl(0, [Validators.required]),
    });
    this.expensesJourneyGroup = new UntypedFormGroup({
      expenses: new UntypedFormArray([]),
      drives: new UntypedFormArray([]),
    });
  }

  private refreshShownHoursMinutes(): void {
    const actualMinutes = parseInt(this.hourFormGroup.get("minutes").value, 10);
    this.hourFormGroup.get("showingHours").setValue(Math.trunc(actualMinutes / 60));
    this.hourFormGroup.get("showingMinutes").setValue(actualMinutes % 60);
  }

  private refreshSpentMinutes(): void {
    let spendMinutes = 0;
    for (const jobList of this.getAllJobs()) {
      for (const job of jobList.controls) {
        spendMinutes += parseInt(job.get("minutes").value, 10);
        spendMinutes += parseInt(job.get("minutesDirection").value, 10);
      }
    }
    spendMinutes += parseInt(this.jobFormGroup.get("additionalJob").get("minutes").value, 10);
    spendMinutes += parseInt(this.jobFormGroup.get("maintenanceMinutes").value, 10);
    const spendableMinutes = parseInt(this.hourFormGroup.get("minutes").value, 10) - spendMinutes;
    this.jobFormGroup.get("spendableMinutes").setValue(spendableMinutes);
    this.availableHoursString = this.getAvailableHoursString();
  }

  private initJobs(): void {
    this.jobs$.pipe(first()).subscribe((jobs) => {
      for (const job of jobs) {
        if (job.status.status === "JOBSTATUS_ACCEPTED") {
          this.getJobs(JobEnum.accepted).push(HoursStepperComponent.initSingleJob(0, 0, job));
        }
        if (job.status.status === "JOBSTATUS_CREATED") {
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
        this.jobs$ = this.api.readJobsJobGet(0, 200, "", undefined, "JOBSTATUS_ACCEPTED, JOBSTATUS_CREATED", true);
      } else {
        this.jobs$ = this.api.readJobsJobGet(0, 200, "", undefined, "JOBSTATUS_ACCEPTED", true);
      }
      this.initJobs();
    });
    this.cars$ = this.api.getCarsCarGet();
    this.eatingPlaces$ = this.api.getEatingPlacesEatingPlaceGet();
  }

  private fillData() {
    this.hourFormGroup.get("minutes").setValue(this.workDay.minutes);

    this.mealFormGroup.get("eatingPlaceId").setValue([this.workDay.eating_place.id]);

    if (this.workDay.additional_workloads.length > 0) {
      const additionalJobGroup = this.jobFormGroup.get("additionalJob");
      additionalJobGroup.get("minutes").setValue(this.workDay.additional_workloads[0].minutes);
      additionalJobGroup.get("description").setValue(this.workDay.additional_workloads[0].description);
    }

    this.getExpenses().clear();
    for (const expense of this.workDay.expenses) {
      this.getExpenses().push(this.initExpense(expense));
    }

    this.getDrives().clear();
    for (const drive of this.workDay.drives) {
      this.getDrives().push(this.initDrive(drive));
    }

  }

  private fillDataJobs() {
    this.jobFormGroup.get("maintenanceMinutes").setValue(0);
    for (const jobControlList of this.getAllJobs()) {
      for (const jobControl of jobControlList.controls) {
        jobControl.get("minutes").setValue(0);
        jobControl.get("minutesDirection").setValue(0);
        for (const jobSection of this.workDay.job_sections) {
          if (!jobSection.job) {
            this.jobFormGroup.get("maintenanceMinutes").setValue(jobSection.minutes);
            continue;
          }
          if (jobSection.job.id === parseInt(jobControl.get("jobId").value, 10)) {
            jobControl.get("minutes").setValue(jobSection.minutes);
            jobControl.get("minutesDirection").setValue(jobSection.minutes_direction);
          }
        }
      }
    }
    this.refreshSpentMinutes();
    this.jobsReadySubscriber$.next();
  }

  private subscribeToWorkday() {
    if (this.workDay$ !== undefined) {
      this.workDay$.subscribe((workDay) => {
        this.workDay = workDay;
        this.fillData();
        this.fillDataJobs();
        this.refreshData();
      });
    }

  }
}

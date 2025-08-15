import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {UntypedFormArray, UntypedFormGroup} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HoursStepperComponent, JobEnum} from "../hours-stepper.component";
import {MatStepper, StepperOrientation} from "@angular/material/stepper";

export enum HoursStepperVariantEnum {
    client,
    maintenance,
    custom
}

export interface HoursStepperDialogData {
    jobGroup: UntypedFormGroup;
    additionalJobs: UntypedFormGroup;
    variant: HoursStepperVariantEnum;
    selectedJobList: number;
    selectedJobIndex: number;
    hourFormGroup: UntypedFormGroup;
}

@Component({
    selector: 'app-hours-stepper-job-dialog',
    templateUrl: './hours-stepper-job-dialog.component.html',
    styleUrls: ['./hours-stepper-job-dialog.component.scss']
})
export class HoursStepperJobDialogComponent implements OnInit {

    showClients = false;
    showMaintenance = false;
    showAdditionalJobs = false;
    confirmDisabled = true;

    title = "";
    availableHoursString = "";

    jobFormGroup: UntypedFormGroup;
    hourFormGroup: UntypedFormGroup;

    selectedJobList = 0;
    selectedJobIndex = 0;
    stepperOrientation: StepperOrientation = "horizontal";
    clientsSite = 0;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @ViewChild('stepper') private stepper: MatStepper;

    constructor(public dialogRef: MatDialogRef<HoursStepperJobDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: HoursStepperDialogData) {
    }

    ngOnInit(): void {
        this.hourFormGroup = this.data.hourFormGroup;
        this.jobFormGroup = this.data.jobGroup;
        switch (this.data.variant) {
            case HoursStepperVariantEnum.client:
                this.showClients = true;
                this.title = "Kunde";
                break;
            case HoursStepperVariantEnum.custom:
                this.showAdditionalJobs = true;
                this.confirmDisabled = false;
                this.title = "Frei eintragen";
                break;
            case HoursStepperVariantEnum.maintenance:
                this.showMaintenance = true;
                this.title = "Instandhaltung";
                this.confirmDisabled = false;
                break;
        }

        if (window.innerWidth < 600) {
            this.stepperOrientation = "vertical";
        }
        if (this.data.selectedJobIndex >= 0 && this.data.selectedJobList >= 0) {
            this.selectedJobList = this.data.selectedJobList;
            this.selectedJobIndex = this.data.selectedJobIndex;
            this.refreshJobWidget();
        }
        this.refreshSpentMinutes();
    }

    onConfirmClick(): void {
        const data: HoursStepperDialogData = {
            jobGroup: this.jobFormGroup,
            additionalJobs: this.jobFormGroup.get("additionalJob") as UntypedFormGroup,
            hourFormGroup: this.hourFormGroup,
            variant: this.data.variant,
            selectedJobIndex: this.selectedJobIndex,
            selectedJobList: this.selectedJobList
        };
        this.dialogRef.close(data);

    }

    getJobListName(jobEnum: JobEnum) {
        switch (jobEnum) {
            case JobEnum.accepted:
                return "Angenommen";
            case JobEnum.created:
                return "Erstellt";
        }
    }

    onCancelClick(): void {
        this.dialogRef.close();
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

    getAllJobs(): UntypedFormArray[] {
        return [
            this.getJobs(JobEnum.accepted),
            this.getJobs(JobEnum.created)
        ];
    }

    getJobs(jobEnum: JobEnum): UntypedFormArray {
        switch (jobEnum) {
            case JobEnum.accepted:
                return this.jobFormGroup.get("jobsAccepted") as UntypedFormArray;
            case JobEnum.created:
                return this.jobFormGroup.get("jobsCreated") as UntypedFormArray;
        }
    }

    getAvailableHoursString(): string {
        const spendableMinutes = parseInt(this.jobFormGroup.get("spendableMinutes").value, 10);
        const hours = Math.trunc(spendableMinutes / 60);
        const minutes = spendableMinutes % 60;
        return HoursStepperComponent.generateHourString(hours, minutes);
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

    getNameFromJob(i: number, jobEnum: JobEnum): string {
        return this.getJobs(jobEnum).at(i).get("name").value;
    }

    getMinutesFromJob(i: number, jobEnum: JobEnum, direction): number {
        const fieldName = direction ? "minutesDirection" : "minutes";
        return parseInt(this.getJobs(jobEnum).at(i).get(fieldName).value, 10);
    }

    jobClicked(i: number, j: number) {
        this.selectedJobIndex = i;
        this.selectedJobList = j;
        this.refreshJobWidget();
    }

    refreshJobWidget(): void {
        this.confirmDisabled = false;
        this.clientsSite = 1;
        this.title = "Kunde: " + this.getNameFromJob(this.selectedJobIndex, this.selectedJobList);
    }

    getMinutesStringFromJob(index: number, direction: boolean, jobEnum: JobEnum): string {
        const fieldName = direction ? "minutesDirection" : "minutes";
        const minutes = parseInt(this.getJobs(jobEnum).at(index).get(fieldName).value, 10);
        // eslint-disable-next-line max-len
        return HoursStepperComponent.generateHourString(Math.trunc(minutes / 60), minutes % 60);
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

}

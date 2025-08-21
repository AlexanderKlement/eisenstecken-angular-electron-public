import {Component, Inject, OnInit} from "@angular/core";
import {JobEnum} from "../hours-stepper.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup} from "@angular/forms";


export interface HoursStepperDriveDialogData {
    jobEnums: JobEnum[];
    reason?: string;
    jobId?: number;
    jobFormGroup: UntypedFormGroup;
}

@Component({
    selector: 'app-hours-stepper-drive-dialog',
    templateUrl: './hours-stepper-drive-dialog.component.html',
    styleUrls: ['./hours-stepper-drive-dialog.component.scss'],
    standalone: false
})
export class HoursStepperDriveDialogComponent implements OnInit {
    confirmDisabled: true;
    jobFormGroup: UntypedFormGroup;
    reasonGroup: UntypedFormGroup;

    constructor(public dialogRef: MatDialogRef<HoursStepperDriveDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: HoursStepperDriveDialogData) {
    }

    ngOnInit(): void {
        this.jobFormGroup = this.data.jobFormGroup;
        this.reasonGroup = new UntypedFormGroup({
            reason: new UntypedFormControl(""),
        });
    }

    getJobListName(jobEnum: JobEnum) {
        switch (jobEnum) {
            case JobEnum.accepted:
                return "Angenommen";
            case JobEnum.created:
                return "Erstellt";
        }
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

    onCancelClick(): void {
        this.dialogRef.close();
    }

    jobClicked(i: number, j: number) {
        const jobId = this.getJobs(j).at(i).get("jobId").value;
        const data = this.data;
        this.data.jobId = jobId;
        this.dialogRef.close(data);
    }

    getNameFromJob(i: number, jobEnum: JobEnum): string {
        return this.getJobs(jobEnum).at(i).get("name").value;
    }

    onConfirmClick() {
        const data = this.data;
        this.data.reason = this.reasonGroup.get("reason").value;
        this.dialogRef.close(data);
    }
}

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CompanyEventCreate, DefaultService} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup} from '@angular/forms';
import {colors} from '../company-event-colors';
import {first} from 'rxjs/operators';

export interface CompanyEventEditData {
    id: number;
}

@Component({
    selector: 'app-company-event-edit-dialog',
    templateUrl: './company-event-edit-dialog.component.html',
    styleUrls: ['./company-event-edit-dialog.component.scss']
})
export class CompanyEventEditDialogComponent implements OnInit {

    title = 'Eintrag ';
    create: boolean;

    colors = colors;

    showSpinners = true;
    showSeconds = false;
    stepHour = 1;
    stepMinute = 5;
    stepSecond = 1;
    touchUi = false;
    enableMeridian = false;
    disableMinute = false;
    hideTime = false;

    companyEventFormGroup: FormGroup;

    constructor(public dialogRef: MatDialogRef<CompanyEventEditDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: CompanyEventEditData, private api: DefaultService) {
    }

    ngOnInit(): void {
        this.create = this.data.id < 0;

        if (this.create) {
            this.title += 'erstellen';
        } else {
            this.title += ' bearbeiten';
        }

        this.initCompanyEventFormGroup();

        if (!this.create) {
            this.api.readCompanyEventCompanyEventCompanyEventIdGet(this.data.id).pipe(first()).subscribe((companyEvent) => {
                this.companyEventFormGroup.patchValue({
                    title: companyEvent.title,
                    allDay: companyEvent.all_day,
                    startTime: companyEvent.start_time,
                    endTime: companyEvent.end_time,
                    color: companyEvent.color,
                });
            });
        }
    }

    initCompanyEventFormGroup(): void {
        this.companyEventFormGroup = new FormGroup({
            title: new FormControl(''),
            allDay: new FormControl(false),
            startTime: new FormControl(new Date()),
            endTime: new FormControl(new Date()),
            color: new FormControl('blue')
        });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }


    onSubmitClick(): void {
        const companyEventCreateUpdate: CompanyEventCreate = {
            title: this.companyEventFormGroup.get('title').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            all_day: this.companyEventFormGroup.get('allDay').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            start_time: this.companyEventFormGroup.get('startTime').value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            end_time: this.companyEventFormGroup.get('endTime').value,
            color: this.companyEventFormGroup.get('color').value
        };
        if (this.create) {
            this.api.createCompanyEventCompanyEventPost(companyEventCreateUpdate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        } else {
            this.api.updateCompanyEventCompanyEventCompanyEventIdPut(this.data.id, companyEventCreateUpdate).pipe(first()).subscribe(() => {
                this.dialogRef.close(true);
            });
        }

    }

}

import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormGroup} from '@angular/forms';
import {HoursStepperComponent} from '../hours-stepper/hours-stepper.component';
import {DefaultService} from 'eisenstecken-openapi-angular-library';
import {first, map} from 'rxjs/operators';
import {forkJoin, Observable} from 'rxjs';

@Component({
    selector: 'app-hours-summary',
    templateUrl: './hours-summary.component.html',
    styleUrls: ['./hours-summary.component.scss']
})
export class HoursSummaryComponent implements OnInit {

    @Input() hourFormGroup: FormGroup;
    @Input() jobFormGroup: FormGroup;
    @Input() mealFormGroup: FormGroup;
    @Input() expensesJourneyGroup: FormGroup;
    @Input() jobsReady$: Observable<void>;

    eatingPlaceName = '';
    driveStrings: string[] = [];
    showJobs = false;
    maintenanceString = '';
    additionalWorkloadString = '';

    constructor(private api: DefaultService) {
    }

    ngOnInit(): void {
        this.mealFormGroup.valueChanges.subscribe(() => {
            this.refreshEatingPlace();
            this.mealFormGroup.get('eatingPlaceId').valueChanges.subscribe(() => {
                this.refreshEatingPlace();
            });
        });
        this.expensesJourneyGroup.valueChanges.subscribe(() => {
            this.refreshDrives();
        });
        this.refreshEatingPlace();
        this.refreshDrives();
        this.refreshMaintenanceString();
        this.refreshAdditionalWorkloadString();
        this.jobsReady$.subscribe(() => {
            console.log('Refresh Jobs');
            this.showJobs = false;
            this.showJobs = true;
            this.refreshMaintenanceString();
            this.refreshAdditionalWorkloadString();
        });
    }

    refreshAdditionalWorkloadString(): void {
        const additionaWorkloadMinutes = parseInt(this.jobFormGroup.get('additionalJob').get('minutes').value, 10);
        if (additionaWorkloadMinutes > 0) {
            const description = this.jobFormGroup.get('additionalJob').get('description').value;
            this.additionalWorkloadString = description + ': ' + this.getHoursStringFromMinutes(additionaWorkloadMinutes);
        }
    }

    refreshMaintenanceString(): void {
        const minutes = parseInt(this.jobFormGroup.get('maintenanceMinutes').value, 10)
        this.maintenanceString = 'Instandhaltung: ' + this.getHoursStringFromMinutes(minutes);
    }

    getHoursStringFromMinutes(inputMinutes: number): string {
        const hours = Math.floor(inputMinutes / 60);
        const minutes = inputMinutes % 60;
        return HoursStepperComponent.generateHourString(hours, minutes);
    }

    getWorkedHoursString(): string {
        const hours = parseInt(this.hourFormGroup.get('showingHours').value, 10);
        const minutes = parseInt(this.hourFormGroup.get('showingMinutes').value, 10);
        return HoursStepperComponent.generateHourString(hours, minutes);
    }

    getJobs(): FormArray {
        return this.jobFormGroup.get('jobs') as FormArray;
    }

    showJob(job: AbstractControl): boolean {
        const minutes = parseInt(job.get('minutes').value, 10);
        const minutesDirection = parseInt(job.get('minutesDirection').value, 10);
        return minutes > 0 || minutesDirection > 0;
    }

    getMinutesStringByJob(job: AbstractControl, direction: boolean): string {
        let formControlString = 'minutes';
        if (direction) {
            formControlString = 'minutesDirection';
        }
        const minutes = parseInt(job.get(formControlString).value, 10);
        return HoursStepperComponent.generateHourString(Math.floor(minutes / 60), minutes % 60);
    }

    getExpenses(): FormArray {
        return this.expensesJourneyGroup.get('expenses') as FormArray;
    }

    getDrives(): FormArray {
        return this.expensesJourneyGroup.get('drives') as FormArray;
    }

    private refreshEatingPlace(): void {
        const eatingPlaceId = parseInt(this.mealFormGroup.get('eatingPlaceId').value, 10);
        this.api.getEatingPlacesEatingPlaceEatingPlaceIdGet(eatingPlaceId).pipe(first()).subscribe((eatingPlace) => {
            if (eatingPlace) {
                this.eatingPlaceName = eatingPlace.name;
            }
        });
    }

    private refreshDrives(): void {
        const newDriveStrings: string[] = [];
        const carObservables$: Observable<void>[] = [];
        for (const drive of this.getDrives().controls) {
            const carId = parseInt(drive.get('car_id').value, 10);
            carObservables$.push(this.api.getCarCarCarIdGet(carId).pipe(map((car) => {
                const driveString = car.name + ': ' + drive.get('km').value + ' km';
                newDriveStrings.push(driveString);
            })));
        }
        forkJoin(carObservables$).subscribe(() => {
            this.driveStrings = newDriveStrings;
        });
    }
}

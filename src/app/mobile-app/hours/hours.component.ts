import {Component, HostListener, OnInit} from '@angular/core';
import {CustomButton} from '../../shared/components/toolbar/toolbar.component';
import {Observable, Subscriber} from 'rxjs';
import {NavigationService} from '../../shared/services/navigation.service';
import {DefaultService, WorkDay} from 'eisenstecken-openapi-angular-library';
import {first} from 'rxjs/operators';


@Component({
    selector: 'app-hours',
    templateUrl: './hours.component.html',
    styleUrls: ['./hours.component.scss']
})
export class HoursComponent implements OnInit {

    loading = true;
    buttons: CustomButton[] = [];
    stepBackObservable$: Observable<void>;
    stepBackSubscriber$: Subscriber<void>;
    todaysWorkDayFinished = false;
    workDay: WorkDay;

    constructor(private navigation: NavigationService, private api: DefaultService) {
    }

    @HostListener('window:popstate', ['$event'])
    onBrowserBackBtnClose(event: Event) {
        console.log('CustomBackEvent');
        event.preventDefault();
        this.stepBackSubscriber$.next();
    }

    ngOnInit(): void {
        this.stepBackObservable$ = new Observable<void>(subscriber => {
            if (this.stepBackSubscriber$ === undefined) {
                console.error('Could not go back. The subscriber does not exist');
            } else {
                this.stepBackSubscriber$ = subscriber;
            }
        });
        this.api.getCurrentWorkDayWorkDayCurrentGet().pipe(first()).subscribe((workDay) => {
            if (workDay) {
                this.todaysWorkDayFinished = true;
            }
            console.log(workDay);
            this.workDay = workDay;
            this.loading = false;
        });
    }

    goBack(): void {
        this.navigation.back();
    }

    editButtonClicked() {
        this.todaysWorkDayFinished = false;
    }
}

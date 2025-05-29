import { Component, HostListener, OnInit } from '@angular/core';
import { CustomButton, ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import { Observable, Subject, Subscriber } from 'rxjs';
import { NavigationService } from '../../shared/services/navigation.service';
import { first } from 'rxjs/operators';
import { DefaultService, WorkDay } from '../../../client/api';
import { HoursStepperComponent } from './hours-stepper/hours-stepper.component';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.scss'],
  imports: [ToolbarComponent, HoursStepperComponent, MatButton, NgIf],
})
export class HoursComponent implements OnInit {
  loading = true;
  buttons: CustomButton[] = [];
  stepBackSubject$: Subject<void> = new Subject<void>();
  todaysWorkDayFinished = false;
  workDay$: Subject<WorkDay>;

  constructor(
    private navigation: NavigationService,
    private api: DefaultService
  ) {}

  /*
    @HostListener('window:popstate', ['$event'])
    onPopState(event) {
        console.log('CustomBackEvent');
        event.preventDefault();
        this.stepBackSubject$.next();
    }

     */

  ngOnInit(): void {
    this.workDay$ = new Subject<WorkDay>();
    this.api
      .getCurrentWorkDayWorkDayCurrentGet()
      .pipe(first())
      .subscribe(workDay => {
        if (workDay) {
          this.todaysWorkDayFinished = true;
        }
        console.log('HoursComponent: Downloading Subject', workDay);
        this.workDay$.next(workDay);
        this.loading = false;
      });
  }

  editButtonClicked() {
    this.todaysWorkDayFinished = false;
  }
}

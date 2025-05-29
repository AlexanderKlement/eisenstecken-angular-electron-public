import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ToolbarComponent } from '../../shared/components/toolbar/toolbar.component';
import {
  MatFormField,
  MatInput,
  MatLabel,
  MatSuffix,
} from '@angular/material/input';
import { HoursStepperComponent } from '../../mobile-app/hours/hours-stepper/hours-stepper.component';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';

@Component({
  selector: 'app-work-day-new',
  templateUrl: './work-day-new.component.html',
  styleUrls: ['./work-day-new.component.scss'],
  imports: [
    ToolbarComponent,
    MatFormField,
    MatLabel,
    MatFormField,
    MatInput,
    MatSuffix,
    HoursStepperComponent,
    MatDatepickerInput,
    MatLabel,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    ReactiveFormsModule,
  ],
})
export class WorkDayNewComponent implements OnInit {
  newWorkday: any;
  loading = true;
  userId: number;
  selectedDate: Date;
  dateFormControl: UntypedFormControl;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dateFormControl = new UntypedFormControl(new Date());
    this.dateFormControl.valueChanges.subscribe(() => {
      this.selectedDate = new Date(this.dateFormControl.value);
      console.log(this.selectedDate);
    });
    this.route.params.subscribe(params => {
      this.userId = parseInt(params.id, 10);
      if (isNaN(this.userId)) {
        console.error('RecalculationDetail: Cannot parse jobId');
        this.router.navigateByUrl('employee');
        return;
      }
      this.loading = false;
    });
  }
}

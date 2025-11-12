import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { UntypedFormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput, MatSuffix } from "@angular/material/input";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { HoursStepperComponent } from "../../mobile-app/hours/hours-stepper/hours-stepper.component";

@Component({
    selector: 'app-work-day-new',
    templateUrl: './work-day-new.component.html',
    styleUrls: ['./work-day-new.component.scss'],
    imports: [ToolbarComponent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatDatepickerInput, FormsModule, ReactiveFormsModule, MatDatepickerToggle, MatSuffix, MatDatepicker, HoursStepperComponent]
})
export class WorkDayNewComponent implements OnInit {
  newWorkday: any;
  loading = true;
  userId: number;
  selectedDate: Date;
  dateFormControl: UntypedFormControl;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.dateFormControl = new UntypedFormControl(new Date());
    this.dateFormControl.valueChanges.subscribe(() =>  {
        this.selectedDate = new Date(this.dateFormControl.value);
    });
    this.route.params.subscribe(params => {
      this.userId = parseInt(params.id, 10);
      if (isNaN(this.userId)) {
        console.error("RecalculationDetail: Cannot parse jobId");
        this.router.navigateByUrl("employee");
        return;
      }
      this.loading = false;
    });
  }

}

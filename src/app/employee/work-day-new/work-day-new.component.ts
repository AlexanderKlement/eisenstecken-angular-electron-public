import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-work-day-new',
  templateUrl: './work-day-new.component.html',
  styleUrls: ['./work-day-new.component.scss']
})
export class WorkDayNewComponent implements OnInit {
  newWorkday: any;
  loading = true;
  userId: number;
  selectedDate: Date;
  dateFormControl: FormControl;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.dateFormControl = new FormControl(new Date());
    this.dateFormControl.valueChanges.subscribe(() =>  {
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

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CompanyEventEnum} from '../../../../../eisenstecken-openapi-angular-library';
import {AuthService} from '../../../shared/services/auth.service';
import {CompanyEventCreate, CompanyEventUpdate, DefaultService} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup} from '@angular/forms';


export interface EventCalendarDialogData {
  id?: number;
  date: string;
}


export function getEventTranslation(companyEvent: CompanyEventEnum): string {
  switch (companyEvent) {
    case CompanyEventEnum.Holiday:
      return 'Urlaub';
    case CompanyEventEnum.Illness:
      return 'Krankheit';
    case CompanyEventEnum.Vacation:
      return 'Betriebsferien';
    case CompanyEventEnum.Event:
      return 'Ereignis';
  }
}

@Component({
  selector: 'app-event-calendar-dialog',
  templateUrl: './event-calendar-dialog.component.html',
  styleUrls: ['./event-calendar-dialog.component.scss']
})


export class EventCalendarDialogComponent implements OnInit {
  title = 'Eintrag erstellen';

  availableEventTypes = [
    CompanyEventEnum.Holiday,
    CompanyEventEnum.Illness,
  ];

  dialogFormGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<EventCalendarDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EventCalendarDialogData,
              private api: DefaultService, private authService: AuthService) {
  }


  ngOnInit(): void {
    if (this.data.id) {
      this.title = 'Eintrag bearbeiten';
    }

    this.authService.getCurrentUser().subscribe(user => {
      if (user.id < 3) {
        this.availableEventTypes.push(CompanyEventEnum.Vacation);
        this.availableEventTypes.push(CompanyEventEnum.Event);
      }
    });

    this.dialogFormGroup = new FormGroup({
      title: new FormControl(''),
      eventType: new FormControl([])
    });

    if (this.data.id) {
      this.api.readCompanyEventCompanyEventCompanyEventIdGet(this.data.id).subscribe(event => {
        this.dialogFormGroup.get('title').setValue(event.title);
        this.dialogFormGroup.get('eventType').setValue(event.event_type);
      });
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.data.id) {
      const companyUpdate: CompanyEventUpdate = {
        title: this.dialogFormGroup.get('title').value,
        date: this.data.date,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        event_type: this.dialogFormGroup.get('eventType').value[0],
      };
      this.api.updateCompanyEventCompanyEventCompanyEventIdPut(this.data.id, companyUpdate).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      const companyCreate: CompanyEventCreate = {
        title: this.dialogFormGroup.get('title').value,
        date: this.data.date,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        event_type: this.dialogFormGroup.get('eventType').value[0],
      };
      this.api.createCompanyEventCompanyEventPost(companyCreate).subscribe(() => {
        console.log('created');
        this.dialogRef.close(true);
      });
    }
  }

  translate(event: CompanyEventEnum): string {
    return getEventTranslation(event);
  }
}

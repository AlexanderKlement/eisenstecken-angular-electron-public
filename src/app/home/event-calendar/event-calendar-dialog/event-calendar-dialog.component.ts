import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { AuthService } from '../../../shared/services/auth.service';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  CompanyEventCreate,
  CompanyEventEnum,
  CompanyEventUpdate,
  DefaultService,
} from '../../../../client/api';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { JsonPipe, NgForOf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';

export interface EventCalendarDialogData {
  id?: number;
  date: string;
}

export function getEventTranslation(companyEvent: CompanyEventEnum): string {
  switch (companyEvent) {
    case CompanyEventEnum.HOLIDAY:
      return 'Urlaub';
    case CompanyEventEnum.ILLNESS:
      return 'Krankheit';
    case CompanyEventEnum.VACATION:
      return 'Betriebsferien';
    case CompanyEventEnum.EVENT:
      return 'Ereignis';
  }
}

@Component({
  selector: 'app-event-calendar-dialog',
  templateUrl: './event-calendar-dialog.component.html',
  styleUrls: ['./event-calendar-dialog.component.scss'],
  imports: [
    MatSelectionList,
    MatListOption,
    MatFormField,
    JsonPipe,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatFormField,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatFormField,
    NgForOf,
    MatLabel,
  ],
})
export class EventCalendarDialogComponent implements OnInit {
  title = 'Eintrag erstellen';

  availableEventTypes = [CompanyEventEnum.HOLIDAY, CompanyEventEnum.ILLNESS];

  dialogFormGroup: UntypedFormGroup;
  showDescription = false;

  constructor(
    public dialogRef: MatDialogRef<EventCalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventCalendarDialogData,
    private api: DefaultService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.data.id) {
      this.title = 'Eintrag bearbeiten';
    }

    this.dialogFormGroup = new UntypedFormGroup({
      title: new UntypedFormControl(''),
      eventType: new UntypedFormControl([]),
    });

    this.authService.getCurrentUser().subscribe(user => {
      if (user.id <= 5) {
        this.availableEventTypes.push(CompanyEventEnum.VACATION);
        this.availableEventTypes.push(CompanyEventEnum.EVENT);
      }

      if (this.data.id) {
        this.api
          .readCompanyEventCompanyEventCompanyEventIdGet(this.data.id)
          .subscribe(event => {
            this.dialogFormGroup.get('title').setValue(event.title);
            this.dialogFormGroup.get('eventType').setValue([event.event_type]);
          });
      }

      this.dialogFormGroup
        .get('eventType')
        .valueChanges.subscribe((selectedEventType: string | string[]) => {
          this.showDescription =
            selectedEventType[0] === CompanyEventEnum.EVENT;
        });
    });
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
      this.api
        .updateCompanyEventCompanyEventCompanyEventIdPut(
          this.data.id,
          companyUpdate
        )
        .subscribe(() => {
          this.dialogRef.close(true);
        });
    } else {
      const companyCreate: CompanyEventCreate = {
        title: this.dialogFormGroup.get('title').value,
        date: this.data.date,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        event_type: this.dialogFormGroup.get('eventType').value[0],
      };
      this.api
        .createCompanyEventCompanyEventPost(companyCreate)
        .subscribe(() => {
          console.log('created');
          this.dialogRef.close(true);
        });
    }
  }

  onDeleteClick(): void {
    this.api
      .deleteCompanyEventCompanyEventCompanyEventIdDelete(this.data.id)
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }

  translate(event: CompanyEventEnum): string {
    return getEventTranslation(event);
  }
}

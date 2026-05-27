import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { AuthStateService } from "../../../shared/services/auth-state.service";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { CompanyEventCreate, CompanyEventEnum, CompanyEventUpdate, DefaultService } from "../../../../api/openapi";
import { MatListOption, MatSelectionList } from "@angular/material/list";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { JsonPipe } from "@angular/common";

export interface EventCalendarDialogData {
  id?: number;
  date: string;
}


export function getEventTranslation(companyEvent: CompanyEventEnum): string {
  switch (companyEvent) {
    case CompanyEventEnum.Holiday:
      return "Urlaub";
    case CompanyEventEnum.Illness:
      return "Krankheit";
    case CompanyEventEnum.Vacation:
      return "Betriebsferien";
    case CompanyEventEnum.Event:
      return "Ereignis";
  }
}

@Component({
  selector: "app-event-calendar-dialog",
  templateUrl: "./event-calendar-dialog.component.html",
  styleUrls: ["./event-calendar-dialog.component.scss"],
  imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, MatSelectionList, MatListOption, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton, JsonPipe]
})


export class EventCalendarDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<EventCalendarDialogComponent>>(MatDialogRef);
  data = inject<EventCalendarDialogData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);
  private authService = inject(AuthStateService);

  title = "Eintrag erstellen";

  availableEventTypes: CompanyEventEnum[] = [
    CompanyEventEnum.Holiday,
    CompanyEventEnum.Illness
  ];

  dialogFormGroup: UntypedFormGroup;
  showDescription = false;


  ngOnInit(): void {
    if (this.data.id) {
      this.title = "Eintrag bearbeiten";
    }

    this.dialogFormGroup = new UntypedFormGroup({
      title: new UntypedFormControl(""),
      eventType: new UntypedFormControl([])
    });

    this.authService.getCurrentUser().subscribe(user => {

      if (user.id <= 5) {
        this.availableEventTypes.push(CompanyEventEnum.Vacation);
        this.availableEventTypes.push(CompanyEventEnum.Event);
      }

      if (this.data.id) {
        this.api.readCompanyEventCompanyEventCompanyEventIdGet(this.data.id).subscribe(event => {
          this.dialogFormGroup.get("title").setValue(event.title);
          this.dialogFormGroup.get("eventType").setValue([event.event_type]);
        });
      }

      this.dialogFormGroup.get("eventType").valueChanges.subscribe((selectedEventType: string | string[]) => {
        this.showDescription = selectedEventType[0] === CompanyEventEnum.Event;
      });
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.data.id) {
      const companyUpdate: CompanyEventUpdate = {
        title: this.dialogFormGroup.get("title").value,
        date: this.data.date,
        event_type: this.dialogFormGroup.get("eventType").value[0]
      };
      this.api.updateCompanyEventCompanyEventCompanyEventIdPut(this.data.id, companyUpdate).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      const companyCreate: CompanyEventCreate = {
        title: this.dialogFormGroup.get("title").value,
        date: this.data.date,
        event_type: this.dialogFormGroup.get("eventType").value[0]
      };
      this.api.createCompanyEventCompanyEventPost(companyCreate).subscribe(() => {
        console.log("created");
        this.dialogRef.close(true);
      });
    }
  }

  onDeleteClick(): void {
    this.api.deleteCompanyEventCompanyEventCompanyEventIdDelete(this.data.id).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  translate(event: CompanyEventEnum): string {
    return getEventTranslation(event);
  }
}

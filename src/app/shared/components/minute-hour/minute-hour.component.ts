import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  selector: 'app-minute-hour',
  templateUrl: './minute-hour.component.html',
  styleUrls: ['./minute-hour.component.scss'],
})
export class MinuteHourComponent implements OnInit, OnDestroy {
  @Input() minuteControl: UntypedFormControl;
  @Input() editDisabled = false;
  @Input() title = '';
  @Output() minutesChanged = new EventEmitter<number>();
  minuteHourGroup: UntypedFormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {
    this.minuteHourGroup = new UntypedFormGroup({
      hours: new UntypedFormControl(0),
      minutes: new UntypedFormControl(0),
    });
    if (!this.minuteControl) {
      console.error(
        'MinuteHourComponent: Cannot bootstrap without an external FormControl'
      );
      return;
    }
    this.subscriptions.add(
      this.minuteControl.valueChanges.subscribe(() => {
        this.refreshInternalValues();
      })
    );
    this.subscriptions.add(
      this.minuteHourGroup.get('hours').valueChanges.subscribe(() => {
        this.refreshExternalValues();
      })
    );
    this.subscriptions.add(
      this.minuteHourGroup.get('minutes').valueChanges.subscribe(() => {
        this.refreshExternalValues();
      })
    );
    this.refreshInternalValues();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  focusLost(): void {
    this.minutesChanged.emit(0);
  }

  private refreshInternalValues() {
    const totalMinutes = parseInt(this.minuteControl.value, 10);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.minuteHourGroup.get('hours').setValue(hours, {
      emitEvent: false,
    });
    this.minuteHourGroup.get('minutes').setValue(minutes, {
      emitEvent: false,
    });
  }

  private refreshExternalValues() {
    const hours = parseInt(this.minuteHourGroup.get('hours').value, 10);
    const minutes = parseInt(this.minuteHourGroup.get('minutes').value, 10);
    const totalMinutes = hours * 60 + minutes;
    this.minuteControl.setValue(totalMinutes, {
      emitEvent: false,
    });
  }
}

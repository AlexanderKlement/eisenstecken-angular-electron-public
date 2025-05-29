import { Component } from '@angular/core';
import {
  CustomButton,
  ToolbarComponent,
} from '../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './event-calendar.component.html',
  styleUrls: ['./event-calendar.component.scss'],
  imports: [ToolbarComponent],
})
export class EventCalendarComponent {
  buttons: CustomButton[] = [];
}

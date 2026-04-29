import { Component, OnInit } from "@angular/core";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";

@Component({
  selector: "app-calendar",
  templateUrl: "./event-calendar.component.html",
  styleUrls: ["./event-calendar.component.scss"],
  imports: [ToolbarComponent]
})
export default class EventCalendarComponent implements OnInit {
  buttons: CustomButton[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}

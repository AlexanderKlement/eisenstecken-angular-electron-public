import { Component } from "@angular/core";
import { BaseSettingsComponent } from "../base-settings.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-order-settings",
  templateUrl: "./order-settings.component.html",
  styleUrls: ["./order-settings.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton]
})
export class OrderSettingsComponent extends BaseSettingsComponent {


  keyList = [
    "order_text",
    "order_mail",
    "order_subject",
    "order_text_request",
    "order_mail_request",
    "order_subject_request"
  ];

}

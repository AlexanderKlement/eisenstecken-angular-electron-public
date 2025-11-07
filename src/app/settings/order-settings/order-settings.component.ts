import { Component, OnInit } from "@angular/core";
import { BaseSettingsComponent } from "../base-settings.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DefaultService } from "../../../api/openapi";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'app-order-settings',
    templateUrl: './order-settings.component.html',
    styleUrls: ['./order-settings.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton]
})
export class OrderSettingsComponent extends BaseSettingsComponent implements OnInit {

  keyList = [
    "order_text",
    "order_mail",
    "order_subject",
    "order_text_request",
    "order_mail_request",
    "order_subject_request",
  ];

  constructor(protected api: DefaultService, protected snackBar: MatSnackBar) {
    super(api, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}

import { Component, OnInit } from "@angular/core";
import { BaseSettingsComponent } from "../base-settings.component";
import { MatLegacySnackBar as MatSnackBar } from "@angular/material/legacy-snack-bar";
import { DefaultService } from "../../../api/openapi";

@Component({
  selector: 'app-order-settings',
  templateUrl: './order-settings.component.html',
  styleUrls: ['./order-settings.component.scss'],
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

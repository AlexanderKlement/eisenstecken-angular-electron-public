import { Component, OnInit } from "@angular/core";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {BaseSettingsComponent} from "../base-settings.component";
import {DefaultService} from "../../../api/openapi";

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.scss']
})
export class GeneralSettingsComponent extends BaseSettingsComponent  implements OnInit{

  keyList = [
    "general_name_pre",
    "general_name",
    "general_address_1",
    "general_address_2",
    "general_tel_1",
    "general_tel_2",
    "general_mail",
    "general_site",
    "general_rea",
    "general_iva",
    "general_cf",
    "general_pec",
    "general_code",
    "general_capital",
    "general_job_path",
    "general_order_path",
  ];

  constructor(protected api: DefaultService, protected snackBar: MatSnackBar) {
    super(api, snackBar);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


}

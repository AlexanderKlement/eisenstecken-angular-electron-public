import { Component, OnInit, inject } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {BaseSettingsComponent} from "../base-settings.component";
import {DefaultService} from "../../../api/openapi";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'app-general-settings',
    templateUrl: './general-settings.component.html',
    styleUrls: ['./general-settings.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton]
})
export class GeneralSettingsComponent extends BaseSettingsComponent  implements OnInit{
  protected api: DefaultService;
  protected snackBar: MatSnackBar;


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

  constructor() {
    const api = inject(DefaultService);
    const snackBar = inject(MatSnackBar);

    super(api, snackBar);
  
    this.api = api;
    this.snackBar = snackBar;
  }

  ngOnInit(): void {
    super.ngOnInit();
  }


}

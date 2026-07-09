import { MatSnackBar } from "@angular/material/snack-bar";
import { UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { first } from "rxjs/operators";
import { Component, inject, OnInit } from "@angular/core";
import { DefaultService, ParameterCreate } from "../../api/openapi";

@Component({
  template: ""
})
export abstract class BaseSettingsComponent implements OnInit {

  protected api = inject(DefaultService);
  protected snackBar = inject(MatSnackBar);
  formGroup: UntypedFormGroup;
  submitted = false;

  abstract keyList: string[];

  public onSubmit(): void {
    this.submitted = true;
    this.getParametersFromFromGroupAndPushToServer();
  }


  ngOnInit(): void {
    this.formGroup = new UntypedFormGroup({});
    this.keyList.forEach((key) => {
      this.formGroup.addControl(key, new UntypedFormControl(""));
    });
    this.getAndPushParametersOntoFormGroup();
  }

  private getAndPushParametersOntoFormGroup(): void {
    this.api.getBulkParameterByKeyParameterBulkGetPost(this.keyList).pipe(first()).subscribe((parameters) => {
      parameters.forEach((parameter) => {
        this.formGroup.patchValue({
          [parameter.key]: parameter.value
        });
      });
    });
  }

  private getParametersFromFromGroupAndPushToServer(): void {
    const parameters: ParameterCreate[] = [];
    this.keyList.forEach((key) => {
      parameters.push({
        key,
        value: this.formGroup.get(key).value
      });
    });
    this.api.setBulkParameterByKeyParameterBulkSetPost(parameters).pipe(first()).subscribe({
      next: (success) => {
        if (success) {
          this.snackBar.open("Speichern erfolgreich!", "Ok", {
            duration: 3000
          });
        } else {
          console.error("Save did not work"); //This should not be possible atm
        }
        this.submitted = false;
      }, error: (error) => {
        console.error(error);
        this.submitted = false;
      }
    });
  }


}

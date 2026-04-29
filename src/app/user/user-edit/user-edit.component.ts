import { Component, inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup
} from "@angular/forms";
import { Observable } from "rxjs";
import { first, tap } from "rxjs/operators";
import { MatSelectionList } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthStateService } from "../../shared/services/auth-state.service";
import {
  GenderEnum,
  Lock,
  ScopeEnum,
  User,
  UserCreate,
  UserPassword,
  UserUpdateBase,
  UserUpdateDress,
  UserUpdateEmployment,
  UserUpdateRights
} from "../../../api/openapi";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatCheckbox } from "@angular/material/checkbox";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatIcon } from "@angular/material/icon";
import {
  EmploymentRelationshipControl,
  EmploymentValidatorDirective,
  HourlyControl,
  HourlyValidatorDirective,
  WorkmodelValidatorDirective
} from "./user-edit.directive";


@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
  imports: [
    ToolbarComponent,
    MatTabGroup,
    MatTab,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    DefaultLayoutGapDirective,
    MatSelect,
    MatOption,
    MatCheckbox,
    CircleIconButtonComponent,
    MatDatepickerInput,
    MatDatepicker,
    MatDatepickerToggle,
    MatSuffix,
    MatIcon,
    WorkmodelValidatorDirective,
    HourlyValidatorDirective,
    EmploymentValidatorDirective
  ]
})
export default class UserEditComponent extends BaseEditComponent<User> implements OnInit, OnDestroy {
  private snackBar = inject(MatSnackBar);
  private authService = inject(AuthStateService);


  @ViewChild("rights") rightsSelected: MatSelectionList;
  userGroup: UntypedFormGroup;
  employmentGroup: FormGroup<{
    hourlies: FormArray<FormGroup<HourlyControl>>;
    internal_cost: FormControl<number>;
    workmodel: FormControl<string>;
    tag_uid: FormControl<string>;
    export_tiktak: FormControl<boolean>
    employmentRelationships: FormArray<FormGroup<EmploymentRelationshipControl>>;
  }>;
  passwordGroup: UntypedFormGroup;
  rightsGroup: UntypedFormGroup;
  dressGroup: UntypedFormGroup;

  availableRightCats: { key: string; open: boolean; title: string }[];
  firstTabLabel = "Stammdaten";
  sumYears = 0;
  navigationTarget = "user";
  buttons: CustomButton[] = [];
  grantRightsAvailable = false;
  title = "Benutzer: Bearbeiten";


  lockFunction = (id: number): Observable<Lock> => this.api.islockedUserUsersIslockedUserIdGet(id);

  dataFunction = (id: number): Observable<User> => this.api.readUserUsersUserIdGet(id);

  unlockFunction = (id: number): Observable<boolean> => this.api.unlockUserUsersUnlockUserIdGet(id);

  ngOnInit(): void {
    this.availableRightCats = [];
    super.ngOnInit();
    if (this.createMode) {
      this.firstTabLabel = "Erstellen";
    }
    this.userGroup = new UntypedFormGroup({
      firstname: new UntypedFormControl(""),
      secondname: new UntypedFormControl(""),
      gender: new UntypedFormControl(""),
      birthday: new UntypedFormControl(""),
      birthplace: new UntypedFormControl(""),
      email: new UntypedFormControl(""),
      email_private: new UntypedFormControl(""),
      vat_number: new UntypedFormControl(""),
      address: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
      postal_code: new UntypedFormControl(""),
      country: new UntypedFormControl(""),
      tel: new UntypedFormControl(""),
      password: new UntypedFormControl(""),
      handy: new UntypedFormControl(""),
      handyPrefix: new UntypedFormControl(""),
      position: new UntypedFormControl(""),
      dial: new UntypedFormControl(""),
      cost: new UntypedFormControl(""),
      innovaphone_user: new UntypedFormControl(""),
      innovaphone_pass: new UntypedFormControl(""),
      notifications: new UntypedFormControl(true)
    });
    this.employmentGroup = new FormGroup({
      internal_cost: new FormControl(0),
      workmodel: new FormControl(""),
      tag_uid: new FormControl(""),
      export_tiktak: new FormControl(true),
      hourlies: new FormArray([]),
      employmentRelationships: new FormArray([])
    });
    this.passwordGroup = new UntypedFormGroup({
      password: new UntypedFormControl("")
    });
    this.rightsGroup = new UntypedFormGroup({
      innovaphone_user: new UntypedFormControl(""),
      innovaphone_pass: new UntypedFormControl(""),
      scope: new UntypedFormControl(""),
      key_number: new UntypedFormControl(""),
      coffee_key: new FormControl(true),
      alarm_key: new UntypedFormControl("")
    });
    this.dressGroup = new UntypedFormGroup({
      shirt: new UntypedFormControl(""),
      sweater: new UntypedFormControl(""),
      pants: new UntypedFormControl(""),
      shoes: new UntypedFormControl(""),
      shoe_model: new UntypedFormControl(""),
      belt: new FormControl(false),
      ear_protection: new UntypedFormControl(""),
      sole: new UntypedFormControl(""),
      export_dress: new UntypedFormControl(true)
    });
    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe(allowed => {
      this.grantRightsAvailable = allowed;
      if (allowed) {
        this.buttons.push({
          name: "Benutzer löschen",
          navigate: (): void => {
            this.userDeleteClicked();
          }
        });
      }
    });
    if (this.createMode) {
      this.title = "Benutzer: Erstellen";
    }
  }


  onAddHourly() {
    let hourly = new FormGroup<HourlyControl>({
      id: new FormControl(-1),
      cost: new FormControl(0),
      start_date: new FormControl(""),
      end_date: new FormControl("")
    });
    this.employmentGroup.controls.hourlies.push(hourly);
  }

  onRemoveHourly(index: number) {
    this.employmentGroup.controls.hourlies.removeAt(index);
  }


  onAddRelationship() {
    let relationship = new FormGroup({
        id: new FormControl(-1),
        start_date: new FormControl(""),
        end_date: new FormControl("")
      }
    );
    this.employmentGroup.controls.employmentRelationships.push(relationship);
  }

  onRemoveRelationship(index: number) {
    this.employmentGroup.controls.employmentRelationships.removeAt(index);
  }

  userDeleteClicked(): void {
    this.authService.getCurrentUser().pipe(first()).subscribe(user => {
      if (user.id === this.id) {
        this.snackBar.open("Der derzeit angemeldete Benutzer kann nicht gelöscht werden!"
          , "Ok", {
            duration: 10000
          });
        return;
      }
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: "400px",
        data: {
          title: "Benutzer löschen?",
          text: "Hinweis: Dieser Schritt KANN rückgängig gemacht werden."
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.api.deleteUserUsersUserIdDelete(this.id).pipe(first()).subscribe(
            () => {
              this.router.navigateByUrl(this.navigationTarget);
            });
        }
      });
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  sortDate<T extends { start_date: string }>(a: T, b: T): number {
    try {
      const aDate = new Date(a.start_date);
      const bDate = new Date(b.start_date);
      return aDate.getTime() - bDate.getTime();
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  markHoursAsTouched(idx: number) {
    this.employmentGroup.controls.hourlies.at(idx).get("start_date")?.markAsTouched({ emitEvent: true });
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$.pipe(tap(user => {
        this.userGroup.patchValue(user);
        this.rightsGroup.patchValue(user);
        this.rightsGroup.patchValue({
          scope: user.scopes.at(0),
          coffee_key: user.coffee_key ? "true" : "false"
        });
        this.employmentGroup.patchValue(user);
        this.dressGroup.patchValue(user);
        this.dressGroup.patchValue({
          belt: user.belt ? "true" : "false"
        });
        this.employmentGroup.patchValue({
          workmodel: `${user.hours_monday ?? 0}-${user.hours_tuesday ?? 0}-${user.hours_wednesday ?? 0}-${user.hours_thursday ?? 0}-${user.hours_friday ?? 0}-${user.hours_saturday ?? 0}`
        });
        this.api.getHourlyRatesUsersHourlyRatesUserIdGet(user.id).pipe(
          tap(hourlyRates => {
            hourlyRates.sort(this.sortDate).forEach((hr) => {
              let hourly = new FormGroup({
                cost: new FormControl(hr.rate),
                end_date: new FormControl(hr.end_date),
                id: new FormControl(hr.id),
                start_date: new FormControl(hr.start_date)
              });
              this.employmentGroup.controls.hourlies.push(hourly);
            });
          }),
          first()).subscribe();
        this.api.getEmploymentRelationshipsUsersEmploymentRelationshipsUserIdGet(user.id).pipe(
          tap(empRels => {
            this.sumYears = 0;
            const year_in_ms = 1000 * 60 * 60 * 24 * 365;
            empRels.sort(this.sortDate).forEach(er => {
              let start = new Date(er.start_date);
              let end = er.end_date && er.end_date.length !== 0 ? new Date(er.end_date) : new Date();
              let amount = end.getTime() - start.getTime();
              this.sumYears += amount / year_in_ms;
              let employmentCost = new FormGroup({
                end_date: new FormControl(er.end_date),
                id: new FormControl(er.id),
                start_date: new FormControl(er.start_date)
              });
              this.employmentGroup.controls.employmentRelationships.push(employmentCost);
            });
            this.sumYears = Math.round(this.sumYears * 10) / 10;
          }),
          first()).subscribe();
      }), first()).subscribe();
    }
  }

  createUpdateSuccess(user: User): void {
    this.id = user.id;
    this.navigationTarget = "user/edit/" + user.id.toString();

    this.snackBar.open("Speichern erfolgreich!", "Ok", {
      duration: 3000
    });
    setTimeout(() => {
      this.router.navigateByUrl(this.navigationTarget, { onSameUrlNavigation: "reload" }).then();
    }, 1000);
  }

  onSubmit(): void {
    this.submitted = true;
  }

  onSubmitGeneral(): void {
    this.onSubmit();
    if (this.createMode) {
      const userCreate: UserCreate = {
        email: this.userGroup.get("email").value,
        tel: this.userGroup.get("tel").value,
        firstname: this.userGroup.get("firstname").value,
        secondname: this.userGroup.get("secondname").value,
        password: this.userGroup.get("password").value,
        handy: this.userGroup.get("handy").value,
        dial: this.userGroup.get("dial").value,
        position: this.userGroup.get("position").value,
        innovaphone_user: this.userGroup.get("innovaphone_user").value,
        innovaphone_pass: this.userGroup.get("innovaphone_pass").value,
        notifications: this.userGroup.get("notifications").value
      };
      this.api.createUserUsersPost(userCreate).pipe(first()).subscribe((user) => {
        this.createUpdateSuccess(user);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    } else {
      const userUpdate: UserUpdateBase = {
        email: this.userGroup.get("email").value,
        tel: this.userGroup.get("tel").value,
        firstname: this.userGroup.get("firstname").value,
        secondname: this.userGroup.get("secondname").value,
        handy: this.userGroup.get("handy").value,
        dial: this.userGroup.get("dial").value,
        position: this.userGroup.get("position").value,
        notifications: true,
        address: this.userGroup.get("address").value,
        city: this.userGroup.get("city").value,
        birthday: this.userGroup.get("birthday").value,
        country: this.userGroup.get("country").value,
        gender: this.userGroup.get("gender").value as GenderEnum,
        birthplace: this.userGroup.get("birthplace").value,
        email_private: this.userGroup.get("email_private").value,
        vat_number: this.userGroup.get("vat_number").value,
        postal_code: this.userGroup.get("postal_code").value
      };
      this.api.updateUserBaseUsersBaseUserIdPut(this.id, userUpdate).pipe(first()).subscribe((user) => {
        this.createUpdateSuccess(user);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    }
  }

  onSubmitDress(): void {
    this.onSubmit();
    const userUpdate: UserUpdateDress = {
      shirt: this.dressGroup.get("shirt").value,
      sweater: this.dressGroup.get("sweater").value,
      sole: this.dressGroup.get("sole").value,
      shoe_model: this.dressGroup.get("shoe_model").value,
      shoes: this.dressGroup.get("shoes").value,
      export_dress: this.dressGroup.get("export_dress").value,
      belt: this.dressGroup.get("belt").value === "true",
      pants: this.dressGroup.get("pants").value,
      ear_protection: this.dressGroup.get("ear_protection").value
    };
    this.api.updateUserDressUsersDressUserIdPut(this.id, userUpdate).pipe(first()).subscribe((user) => {
      this.createUpdateSuccess(user);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  onSubmitEmployment(): void {
    const hours = this.employmentGroup.get("workmodel").value.split("-");
    if (hours.length != 6 || !!hours.find(h => Number.isNaN(parseFloat(h)))) {
      this.snackBar.open("Falsches Format für: Arbeitsmodell (M-D-M-D-F-S)!", "Ok", {
        duration: 3000
      });
      return;
    }
    if (!this.employmentGroup.valid) {
      return;
    }
    this.onSubmit();

    const userUpdate: UserUpdateEmployment = {
      export_tiktak: this.employmentGroup.get("export_tiktak").value,
      hours_monday: parseFloat(hours[0]),
      hours_tuesday: parseFloat(hours[1]),
      hours_wednesday: parseFloat(hours[2]),
      hours_thursday: parseFloat(hours[3]),
      hours_friday: parseFloat(hours[4]),
      hours_saturday: parseFloat(hours[5]),
      tag_uid: this.employmentGroup.get("tag_uid").value,
      internal_cost: this.employmentGroup.get("internal_cost").value,
      employment_relationships: this.employmentGroup.get("employmentRelationships").value.map((relGroup) => (
        {
          start_date: relGroup.start_date,
          end_date: relGroup.end_date && relGroup.end_date.length !== 0 ? relGroup.end_date : undefined,
          id: undefined
        }
      )),
      hourly_rates: this.employmentGroup.get("hourlies").value.map(hourly => ({
        start_date: hourly.start_date,
        end_date: hourly.end_date && hourly.end_date.length !== 0 ? hourly.end_date : undefined,
        rate: hourly.cost
      }))
    };
    this.api.updateUserEmploymentUsersEmploymentUserIdPut(this.id, userUpdate).pipe(first()).subscribe((user) => {
      this.createUpdateSuccess(user);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  onSubmitRights(): void {
    this.onSubmit();

    const userUpdate: UserUpdateRights = {
      alarm_key: this.rightsGroup.get("alarm_key").value,
      coffee_key: this.rightsGroup.get("coffee_key").value == "true",
      key_number: this.rightsGroup.get("key_number").value,
      scope: this.rightsGroup.get("scope").value,
      innovaphone_user: this.rightsGroup.get("innovaphone_user").value,
      innovaphone_pass: this.rightsGroup.get("innovaphone_pass").value
    };
    this.api.updateUserRightsUsersRightsUserIdPut(this.id, userUpdate).pipe(first()).subscribe((user) => {
      this.createUpdateSuccess(user);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  onSubmitPassword(): void {
    const userPassword: UserPassword = {
      password: this.passwordGroup.get("password").value
    };
    this.api.updateUserPasswordUsersPasswordUserIdPut(this.id, userPassword).pipe(first()).subscribe((user) => {
      this.createUpdateSuccess(user);
    }, (error) => {
      this.createUpdateError(error);
    }, () => {
      this.createUpdateComplete();
    });
  }

  protected readonly GenderEnum = GenderEnum;
  protected readonly ScopeEnum = ScopeEnum;
  protected readonly JSON = JSON;
}

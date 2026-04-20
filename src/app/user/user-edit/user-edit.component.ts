import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import { Observable } from "rxjs";
import { first, tap } from "rxjs/operators";
import { MatSelectionList } from "@angular/material/list";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthStateService } from "../../shared/services/auth-state.service";
import { DefaultService, Lock, ScopeEnum, User, UserCreate, UserPassword, UserUpdate } from "../../../api/openapi";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { Right } from "../../model/right";
import { MatOption, MatSelect } from "@angular/material/select";
import { MatCheckbox } from "@angular/material/checkbox";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";

const titles = {
  users: "Benutzer",
  calendars: "Kalender",
  vats: "Mehrwertssteuer Einstellungen",
  units: "Einheiten",
  suppliers: "Lieferanten",
  stocks: "Lager",
  rights: "Rechte Verwaltung",
  orders: "Bestellungen",
  offers: "Angebote",
  jobs: "Aufträge",
  parameters: "Parameter Einstellungen",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ingoing_invoices: "Eingangsrechnungen",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  outgoing_invoices: "Ausgangsrechnungen",
  clients: "Kundenverwaltung",
  categories: "Produkt-Kategorien",
  articles: "Produkte",
  reminders: "Mahnwesen",
  payments: "Zahlungen",
  hours: "Stunden eintragen",
  recalculations: "Nachkalkulation",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  delivery_notes: "Lieferscheine",
  prices: "Preise",
  // eslint-disable-next-line @typescript-eslint/naming-convention
  work_hours: "Arbeitsstunden"
};

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
    CircleIconButtonComponent
  ]
})
export class UserEditComponent extends BaseEditComponent<User> implements OnInit, OnDestroy {

  @ViewChild("rights") rightsSelected: MatSelectionList;

  userGroup: UntypedFormGroup;
  workThingsGroup: UntypedFormGroup;
  passwordGroup: UntypedFormGroup;
  rightsGroup: UntypedFormGroup;
  dressGroup: UntypedFormGroup;
  availableRights: Right[];
  availableRightCats: { key: string; open: boolean; title: string }[];
  userRights: Right[];
  rightsLoaded = false;
  firstTabLabel = "Stammdaten";
  sumYears = 0;

  navigationTarget = "user";
  buttons: CustomButton[] = [];
  grantRightsAvailable = false;
  title = "Benutzer: Bearbeiten";

  constructor(private snackBar: MatSnackBar, private authService: AuthStateService, api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog) {
    super(api, router, route, dialog);
  }

  lockFunction = (id: number): Observable<Lock> => this.api.islockedUserUsersIslockedUserIdGet(id);

  dataFunction = (id: number): Observable<User> => this.api.readUserUsersUserIdGet(id);

  unlockFunction = (id: number): Observable<boolean> => this.api.unlockUserUsersUnlockUserIdGet(id);

  onCategoryClick(category: string): void {
    this.availableRightCats = this.availableRightCats.map((cat) => {
      if (cat.key === category) {
        return { key: cat.key, open: !cat.open, title: cat.title };
      } else {
        return cat;
      }
    });
  }

  onCategoryCheck(category: string, checkstate: "unchecked" | "checked" | "indeterminate"): void {
    switch (checkstate) {
      case "checked":
        this.userRights = this.userRights.filter((userRight) => !userRight.key.startsWith(category));
        break;
      case "indeterminate":
      case "unchecked":
        this.availableRights.forEach((right) => {
          if (right.key.startsWith(category) && this.userRights.filter((userRight) => userRight.id === right.id).length === 0) {
            this.userRights.push(right);
          }
        });
        break;
      default:
        break;
    }
  }

  onRightCheck(right: Right): void {
    if (this.userRights.filter(userRight => userRight.id === right.id).length === 0) {
      this.userRights.push(right);
    } else {
      this.userRights = this.userRights.filter((userRight) => userRight.id !== right.id);
    }
  }

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
      birthdate: new UntypedFormControl(""),
      city: new UntypedFormControl(""),
      email: new UntypedFormControl(""),
      tel: new UntypedFormControl(""),
      password: new UntypedFormControl(""),
      handy: new UntypedFormControl(""),
      office: new UntypedFormControl(false),
      employee: new UntypedFormControl(true),
      position: new UntypedFormControl(""),
      dial: new UntypedFormControl(""),
      cost: new UntypedFormControl(""),
      chat: new UntypedFormControl(false),
      hours: new UntypedFormControl(true),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innovaphone_user: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innovaphone_pass: new UntypedFormControl(""),
      notifications: new UntypedFormControl(true)
    });
    this.workThingsGroup = new UntypedFormGroup({
      cost: new UntypedFormControl(""),
      workmodel: new UntypedFormControl(""),
      taguid: new UntypedFormControl(""),
      export: new UntypedFormControl(true)
    });
    this.passwordGroup = new UntypedFormGroup({
      password: new UntypedFormControl("")
    });
    this.rightsGroup = new UntypedFormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innovaphone_user: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      innovaphone_pass: new UntypedFormControl(""),
      right: new UntypedFormControl(""),
      keynumber: new UntypedFormControl(""),
      coffee: new UntypedFormControl(true),
      alarm: new UntypedFormControl("")
    });
    this.dressGroup = new UntypedFormGroup({
      tshirt: new UntypedFormControl(""),
      chestplate: new UntypedFormControl(""),
      leggins: new UntypedFormControl(""),
      shoes: new UntypedFormControl(""),
      shoesmodel: new UntypedFormControl(""),
      shield: new UntypedFormControl(""),
      helmet: new UntypedFormControl(""),
      sohle: new UntypedFormControl(""),
      export: new UntypedFormControl(true)
    });
    if (!this.createMode) {
      /* THIS WILL BE REMOVED
      this.api.getRightsRightsGet().pipe(first()).subscribe((rights) => {
        this.availableRights = rights;
        rights.forEach(right => {
          const rightKeyCat = right.key.split(":")[0];
          if (this.availableRightCats.filter(cat => cat.key === rightKeyCat).length === 0) {
            let title = titles[rightKeyCat];
            if (typeof title === "undefined") {
              title = "Neue Kategorie";
            }
            this.availableRightCats.push({ key: rightKeyCat, open: false, title });
          }
        });
        this.api.readUserUsersUserIdGet(this.id).pipe(first()).subscribe((user) => {
          this.userRights = user.rights;
          this.rightsLoaded = true;
        });
      });
       */
    }
    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe(allowed => {
      this.grantRightsAvailable = allowed;
      if (allowed) {
        this.buttons.push({
          name: "Benutzer löschen",
          navigate: (): void => {
            this.userDeleteClicked();
          }
        });
        this.rightsGroup.patchValue({ right: ScopeEnum.Office });
      }
    });
    this.authService.currentUserHasScope(ScopeEnum.Workshop).pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.rightsGroup.patchValue({ right: ScopeEnum.Workshop });
      }
    });
    this.authService.currentUserHasScope(ScopeEnum.Admin).pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.rightsGroup.patchValue({ right: ScopeEnum.Admin });
      }
    });
    if (this.createMode) {
      this.title = "Benutzer: Erstellen";
    }
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

  userHasRight(rightKey: string): boolean {
    for (const userRight of this.userRights) {
      if (userRight.key === rightKey) {
        return true;
      }
    }
    return false;
  }

  userHasRightCategory(rightCategory: string): "unchecked" | "checked" | "indeterminate" {
    let hasAll = true;
    let hasOne = false;
    for (const right of this.availableRights) {
      if (right.key.startsWith(rightCategory)) {
        if (this.userHasRight(right.key)) {
          hasOne = true;
        }
        if (!this.userHasRight(right.key)) {
          hasAll = false;
        }
      }
    }
    return hasAll ? "checked" : hasOne ? "indeterminate" : "unchecked";
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }


  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$.pipe(tap(user => {
        this.userGroup.patchValue(user);
        this.rightsGroup.patchValue({
          innovaphone_user: user.innovaphone_user,
          innovaphone_pass: user.innovaphone_pass
        });
      }), first()).subscribe();
    }
  }

  createUpdateSuccess(user: User): void {
    this.id = user.id;
    this.navigationTarget = "user/edit/" + user.id.toString();
    this.router.navigateByUrl(this.navigationTarget, { replaceUrl: true });
    this.snackBar.open("Speichern erfolgreich!", "Ok", {
      duration: 3000
    });
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        innovaphone_user: this.userGroup.get("innovaphone_user").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
      const userUpdate: UserUpdate = {
        email: this.userGroup.get("email").value,
        tel: this.userGroup.get("tel").value,
        firstname: this.userGroup.get("firstname").value,
        secondname: this.userGroup.get("secondname").value,
        handy: this.userGroup.get("handy").value,
        dial: this.userGroup.get("dial").value,
        position: this.userGroup.get("position").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        innovaphone_user: this.userGroup.get("innovaphone_user").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        innovaphone_pass: this.userGroup.get("innovaphone_pass").value,
        notifications: this.userGroup.get("notifications").value
      };
      this.api.updateUserUsersUserIdPut(this.id, userUpdate).pipe(first()).subscribe((user) => {
        this.createUpdateSuccess(user);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    }
  }

  onSubmitDress(): void {
    // TODO
  }

  onSubmitWorkThings(): void {
    // TODO
  }

  onSubmitRights(): void {
    const selectedKeys = this.rightsSelected.selectedOptions.selected.map((obj) => obj.value);
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
}

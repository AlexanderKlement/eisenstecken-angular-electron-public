import { Component, OnInit, inject } from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthStateService } from "../shared/services/auth-state.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export default class LoginComponent implements OnInit {
  private authService = inject(AuthStateService);
  protected snackBar = inject(MatSnackBar);
  private router = inject(Router);


  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl(""),
    password: new UntypedFormControl("")
  });

  ngOnInit(): void {
  }

  onSubmit(): void {
    const loginSuccess = this.authService.login(this.loginForm.value.username, this.loginForm.value.password);
    loginSuccess.then((success) => {
      if (success) {
        this.router.navigate(["home"]);
      } else {
        this.snackBar.open("Anmeldung fehlgeschlagen. Email/Password überprüfen", "OK", {
          duration: 10000
        });
      }
    });
  }
}


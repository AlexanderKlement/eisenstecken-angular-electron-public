import {Component, OnInit} from "@angular/core";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, FormsModule, ReactiveFormsModule, MatFormField, MatLabel, MatInput, MatButton]
})
export class LoginComponent implements OnInit {

  loginForm = new UntypedFormGroup({
    username: new UntypedFormControl(""),
    password: new UntypedFormControl(""),
  });

  constructor(private authService: AuthService, protected snackBar: MatSnackBar, private router: Router) {
  }

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


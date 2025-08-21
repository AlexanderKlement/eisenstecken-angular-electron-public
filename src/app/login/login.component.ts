import {Component, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
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


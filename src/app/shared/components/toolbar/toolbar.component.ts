import { Component, Input } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { MatToolbar } from "@angular/material/toolbar";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

export interface CustomButton {
  name: string;
  navigate: VoidFunction;
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    imports: [
        MatToolbar,
        MatButton,
        MatIconButton,
        MatIcon,
    ],
})
export class ToolbarComponent {

  @Input() buttonList?: CustomButton[];
  @Input() title = "";
  @Input() showBackButton = true;
  @Input() showLogoutButton = false;

  constructor(
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private authService: AuthService,
  ) {}

  backButtonClicked(): void {
    this.location.back();
  }

  homeClicked(): void {
    this.router.navigateByUrl("/");
  }

  buttonClicked(button: CustomButton): void {
    button.navigate();
  }

  logoutClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: { title: "Abmelden?", text: "Soll der Benutzer abgemeldet werden?" },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.authService.doLogout();
    });
  }
}

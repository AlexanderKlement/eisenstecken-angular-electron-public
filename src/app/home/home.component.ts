import {Component, OnInit} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";
import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../shared/components/confirm-dialog/confirm-dialog.component";
import {DefaultService} from "../../api/openapi";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthService, private dialog: MatDialog, private api: DefaultService) {
  }

  ngOnInit(): void {
    this.api.readUsersMeUsersMeGet().subscribe(user => {
      console.log(user);
    });
  }


  showInfoClicked(): void {
    this.dialog.open(InfoDialogComponent, {
      width: (window.innerWidth - 100).toString() + "px",
      data: {}
    });
  }

  logoutClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Abmelden?",
        text: "Soll der Benutzer abgemeldet werden?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.doLogout();
      }
    });
  }
}


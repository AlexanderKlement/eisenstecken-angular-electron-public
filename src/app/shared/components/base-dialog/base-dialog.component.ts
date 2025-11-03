import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, NavigationStart } from "@angular/router";
import { filter, Subscription } from "rxjs";

@Component({
  selector: "app-base-dialog",
  imports: [],
  templateUrl: "./base-dialog.component.html",
  styleUrl: "./base-dialog.component.scss",
})
export abstract class BaseDialogComponent implements OnInit, OnDestroy {
  private sub!: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe((event) => {
        if (this.dialog.openDialogs.length > 0) {
          // Close dialogs and prevent navigation
          this.dialog.closeAll();
          history.pushState(null, "", this.router.url); // restore current URL
        }
      });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}

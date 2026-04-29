import { Component, OnInit, inject } from "@angular/core";
import { CustomButton, ToolbarComponent } from "../shared/components/toolbar/toolbar.component";
import { Router } from "@angular/router";
import { MatNavList, MatListItem } from "@angular/material/list";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-mobile-app",
  templateUrl: "./mobile-app.component.html",
  styleUrls: ["./mobile-app.component.scss"],
  imports: [ToolbarComponent, MatNavList, MatListItem, MatIconButton, MatIcon]
})
export default class MobileAppComponent implements OnInit {
  private router = inject(Router);

  buttons: CustomButton[] = [];

  ngOnInit(): void {
  }

  hourButtonClicked() {
    this.router.navigateByUrl("mobile/hours");
  }
}

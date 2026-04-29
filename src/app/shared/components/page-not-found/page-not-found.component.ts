import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-page-not-found",
  templateUrl: "./page-not-found.component.html",
  styleUrls: ["./page-not-found.component.scss"],
  imports: [DefaultLayoutDirective, DefaultLayoutAlignDirective, NgOptimizedImage]
})
export default class PageNotFoundComponent {
  constructor(private router: Router) {
  }


  homeClicked() {
    this.router.navigateByUrl("/", { replaceUrl: true });
  }
}

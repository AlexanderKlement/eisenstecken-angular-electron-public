import { Component, inject } from "@angular/core";
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
  private router = inject(Router);



  homeClicked() {
    this.router.navigateByUrl("/", { replaceUrl: true });
  }
}

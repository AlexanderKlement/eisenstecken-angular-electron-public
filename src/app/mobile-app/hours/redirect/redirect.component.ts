import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-redirect",
  templateUrl: "./redirect.component.html",
  styleUrls: ["./redirect.component.scss"]
})
export default class RedirectComponent implements OnInit {
  private router = inject(Router);


  ngOnInit(): void {
    this.router.navigateByUrl("/mobile/hours", { replaceUrl: true });
  }

}

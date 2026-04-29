import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-employee-redirect",
  templateUrl: "./employee-redirect.component.html",
  styleUrls: ["./employee-redirect.component.scss"]
})
export default class EmployeeRedirectComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = parseInt(params.id, 10);
      if (isNaN(userId)) {
        console.error("EmployeeDetailComponent: Could not parse userId");
        this.router.navigateByUrl("employee");
      } else {
        this.router.navigateByUrl("employee/" + userId.toString());
      }
    });
  }
}

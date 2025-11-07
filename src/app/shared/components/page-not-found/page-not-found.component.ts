import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  standalone: false,
})
class PageNotFoundComponent {
  constructor(private router: Router) {
  }


  homeClicked() {
    this.router.navigateByUrl("/", { replaceUrl: true });
  }
}

export default PageNotFoundComponent;

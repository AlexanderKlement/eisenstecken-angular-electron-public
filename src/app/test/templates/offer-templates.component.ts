import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";


@Component({
  selector: "app-offer-templates",
  templateUrl: "./offer-templates.component.html",
  styleUrls: ["./offer-templates.component.scss"],
  imports: [
    ReactiveFormsModule,
    ToolbarComponent
  ]
})
export default class OfferTemplatesComponent implements OnInit {

  private router = inject(Router);

  title = "Templates";
  buttons = [];

  ngOnInit(): void {

    this.buttons.push({
      name: "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/test").then();
      }
    }, {
      name: "Felder",
      navigate: () => {
        this.router.navigateByUrl("/test/fields").then();
      }
    }, {
      name: "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/test/element_types").then();
      }
    }, {
      name: "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/test/libraries").then();
      }
    }, {
      name: "Templates",
      active: true,
      navigate: () => {
        this.router.navigateByUrl("/test/templates").then();
      }
    });
  }

}

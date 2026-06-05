import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";


@Component({
  selector: "app-offer-libraries",
  templateUrl: "./offer-libraries.component.html",
  styleUrls: ["./offer-libraries.component.scss"],
  imports: [
    ToolbarComponent,
    ReactiveFormsModule
  ]
})
export default class OfferLibrariesComponent implements OnInit {

  private router = inject(Router);

  title = "Bibliotheken";
  buttons = [];

  ngOnInit(): void {

    this.buttons.push({
      name: "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2").then();
      }
    }, {
      name: "Felder",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/fields").then();
      }
    }, {
      name: "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/element_types").then();
      }
    }, {
      name: "Bibliotheken",
      active: true,
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    }, {
      name: "Templates",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
  }

}

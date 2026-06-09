import { Component, inject, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";


@Component({
  selector: "app-offer-container",
  templateUrl: "./offer-container.component.html",
  styleUrls: ["./offer-container.component.scss"],
  imports: [
    ReactiveFormsModule,
    ToolbarComponent
  ]
})
export default class OfferContainerComponent implements OnInit {

  private router = inject(Router);

  @Input() title: string;
  buttons = [];

  ngOnInit(): void {
    this.buttons.push({
      name: "Angebote",
      active: this.title === "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2").then();
      }
    }, {
      name: "Elemente",
      active: this.title === "Elemente",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/elements").then();
      }
    }, {
      name: "Elementtypen",
      active: this.title === "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/element_types").then();
      }
    }, {
      name: "Felder",
      active: this.title === "Felder",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/fields").then();
      }
    }, {
      name: "Bibliotheken",
      active: this.title === "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    }, {
      name: "Einheiten",
      active: this.title === "Einheiten",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/units").then();
      }
    }, {
      name: "Templates",
      active: this.title === "Templates",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
  }

}

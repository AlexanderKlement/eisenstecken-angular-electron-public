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

  @Input() subTitle: string;
  buttons = [];

  ngOnInit(): void {
    this.buttons.push({
      name: "Angebote",
      active: this.subTitle === "Angebote",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2").then();
      }
    }, {
      name: "Elemente",
      active: this.subTitle === "Elemente",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/elements").then();
      }
    }, {
      name: "Elementtypen",
      active: this.subTitle === "Elementtypen",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/element_types").then();
      }
    }, {
      name: "Felder",
      active: this.subTitle === "Felder",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/fields").then();
      }
    }, {
      name: "Bibliotheken",
      active: this.subTitle === "Bibliotheken",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/libraries").then();
      }
    }, {
      name: "Einheiten",
      active: this.subTitle === "Einheiten",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/units").then();
      }
    }, {
      name: "Templates",
      active: this.subTitle === "Templates",
      navigate: () => {
        this.router.navigateByUrl("/offer_v2/templates").then();
      }
    });
  }

}

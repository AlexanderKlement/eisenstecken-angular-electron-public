import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";


@Component({
  selector: "app-offer-fields",
  templateUrl: "./offer-fields.component.html",
  styleUrls: ["./offer-fields.component.scss"],
  imports: [
    ToolbarComponent,
    ReactiveFormsModule
  ]
})
export default class OfferFieldsComponent implements OnInit {

  private router = inject(Router);

  title = "Felder";
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
      navigate: () => {
        this.router.navigateByUrl("/test/templates").then();
      }
    });
  }

}

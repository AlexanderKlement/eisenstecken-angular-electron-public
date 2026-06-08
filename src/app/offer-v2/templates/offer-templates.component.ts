import { Component, inject, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import OfferContainerComponent from "../offer-container/offer-container.component";


@Component({
  selector: "app-offer-templates",
  templateUrl: "./offer-templates.component.html",
  styleUrls: ["./offer-templates.component.scss"],
  imports: [
    ReactiveFormsModule,
    OfferContainerComponent
  ]
})
export default class OfferTemplatesComponent implements OnInit {

  private router = inject(Router);

  ngOnInit(): void {
    console.log("OfferTemplatesComponent ngOnInit");
  }

}

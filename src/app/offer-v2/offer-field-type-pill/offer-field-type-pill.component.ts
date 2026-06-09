import { Component, Input } from "@angular/core";
import { OfferFieldEnum } from "../../../api/openapi";
import { fieldTypeToColor, fieldTypeToString, fieldTypeToTextColor } from "../offer.util";

@Component({
  selector: "app-offer-field-type-pill",
  imports: [],
  templateUrl: "./offer-field-type-pill.component.html",
  styleUrl: "./offer-field-type-pill.component.scss"
})
export class OfferFieldTypePillComponent {
  @Input() fieldType: OfferFieldEnum;


  protected readonly fieldTypeToColor = fieldTypeToColor;
  protected readonly fieldTypeToString = fieldTypeToString;
  protected readonly fieldTypeToTextColor = fieldTypeToTextColor;
}

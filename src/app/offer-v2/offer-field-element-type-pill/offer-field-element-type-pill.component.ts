import { Component, Input } from "@angular/core";
import { OfferFieldEnum } from "../../../api/openapi";
import { fieldTypeToColor, fieldTypeToString, fieldTypeToTextColor } from "../offer.util";

@Component({
  selector: "app-offer-field-element-type-pill",
  imports: [],
  templateUrl: "./offer-field-element-type-pill.component.html",
  styleUrl: "./offer-field-element-type-pill.component.scss"
})
export class OfferFieldElementTypePillComponent {
  @Input() fieldType: OfferFieldEnum | string;


  protected readonly fieldTypeToColor = fieldTypeToColor;
  protected readonly fieldTypeToString = fieldTypeToString;
  protected readonly fieldTypeToTextColor = fieldTypeToTextColor;
}

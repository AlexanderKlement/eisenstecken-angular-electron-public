import { OfferFieldEnum } from "../../api/openapi";

export function fieldTypeToString(type: OfferFieldEnum) {
  switch (type) {
    case OfferFieldEnum.String:
      return "Text";
    case OfferFieldEnum.Text:
      return "Mehrzeiliger Text";
    case OfferFieldEnum.Numeric:
      return "Zahl";
    case OfferFieldEnum.Calculation:
      return "Berechnung";
    case OfferFieldEnum.Select:
      return "Auswahl";
    case OfferFieldEnum.Offertext:
      return "Angebotstext";
  }
}

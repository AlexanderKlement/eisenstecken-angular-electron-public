import { OfferFieldEnum } from "../../api/openapi/api/offer.service";

export function fieldTypeToString(type: OfferFieldEnum) {
  switch (type) {
    case OfferFieldEnum.Alphanumeric:
      return "Text";
    case OfferFieldEnum.Numeric:
      return "Zahl";
    case OfferFieldEnum.Calculation:
      return "Berechnung";
    case OfferFieldEnum.Dropdown:
      return "Auswahl";
    case OfferFieldEnum.Offertext:
      return "Angebotstext";
  }
}

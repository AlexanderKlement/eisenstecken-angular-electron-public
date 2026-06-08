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

export function fieldTypeToColor(type: OfferFieldEnum) {
  switch (type) {
    case OfferFieldEnum.String:
      return "#E6E6E6";
    case OfferFieldEnum.Text:
      return "#E6E6E6";
    case OfferFieldEnum.Numeric:
      return "#a1b1ca";
    case OfferFieldEnum.Calculation:
      return "#E8F9D2";
    case OfferFieldEnum.Select:
      return "#FCDCCF";
    case OfferFieldEnum.Offertext:
      return "#E6E6E6";
  }
}

export function fieldTypeToTextColor(type: OfferFieldEnum) {
  switch (type) {
    case OfferFieldEnum.String:
      return "#000000";
    case OfferFieldEnum.Text:
      return "#000000";
    case OfferFieldEnum.Numeric:
      return "#072a61";
    case OfferFieldEnum.Calculation:
      return "#4D7C0F";
    case OfferFieldEnum.Select:
      return "#C2410C";
    case OfferFieldEnum.Offertext:
      return "#000000";
  }
}

import { FormGroup } from "@angular/forms";
import { OfferEntryGroup } from "./offer-v2-edit/offer-v2-entry-edit/offer-v2-entry-edit.component";
import { OfferFieldEnum } from "../../api/openapi";
import { KeywordRegExp } from "./offer-calculation-utils";
import { formatCurrency } from "@angular/common";

type ParsedFieldOffertext = {
  label: string;
  value: string | string[];
}

function createOffertextCont(formula: string, parsedFields: ParsedFieldOffertext[], isAlternative: boolean): string[] {

  const result: string[] = isAlternative ? ["Alternative:"] : [];
  let expression = formula.replace(/\r/g, "").replace(KeywordRegExp, (field) => {
    const variable = parsedFields.find(v => `@${v.label}`.startsWith(field));
    if (variable) {
      if (typeof variable.value === "string") {
        if (variable.value.trim().length === 0) {
          return "#empty_field#";
        }
        return variable.value;

      }
      if (variable.value.length === 0) {
        return "#empty_field#";
      }
      if (variable.value.reduce((prev, cur) => prev && cur === "#empty_field#", true)) {
        return "#empty_field#";
      }
      return variable.value.join("\n");
    }
    return "#empty_field#";
  });
  expression = expression.replace(/#empty_field#\n/g, "");
  expression = expression.replace(/\n#empty_field#/g, "");
  expression = expression.replace(/#empty_field#/g, "");
  expression.split("\n").forEach(line => {
    result.push(line);
  });
  return result;
}

export function createOffertext(group: FormGroup<OfferEntryGroup>): string[] {
  const visible = group.get("visibleOffer").value;
  if (!visible) {
    return [];
  }
  const parsedFields = group.controls.fields.controls.map<ParsedFieldOffertext>(group => {
    return {
      label: group.get("label").value.replace(/\(.+\)/g, "").trim(),
      value: group.get("type").value === OfferFieldEnum.Select ?
        group.get("valueString").value :
        group.get("value").value
    };
  });
  const formula = group.get("offertext").value;
  if (formula.includes("@children")) {
    let offertextChildren: string[] = [];
    group.controls.children.controls.forEach(control => {
      const res = createOffertext(control);
      res.forEach(child => {
        if (child.replace(/\n/g, "").replace(/\r/g, "").trim().length !== 0)
          offertextChildren.push(child);
      });
    });
    parsedFields.push({
      label: "children",
      value: offertextChildren
    });
  }
  parsedFields.push({
    label: "Beschreibung",
    value: group.controls.description.value
  });
  const res = createOffertextCont(formula, parsedFields, group.get("alternative").value);
  console.log(`offertext for ${group.get("name").value}`, { res, formula, parsedFields });
  return res;
}

export declare type Offertext = {
  prefix: string;
  amount: string;
  lines: (string)[];
  price: string[];
  children: Offertext[];
}

export function offertextEvaluationElementGroup(grp: FormGroup<OfferEntryGroup>, depth: number, index: number, prefix: number): Offertext | null {
  if (!grp.get("visibleOffer").value)
    return null;
  if (depth === 0) {
    return {
      prefix: `${index}`,
      amount: "1",
      lines: createOffertext(grp),
      price: [formatCurrency(grp.controls.priceCalculated.value, "de-DE", "EUR")],
      children: grp.controls.children.controls.filter(child => child.get("visibleOffer").value).map((child, idx) => offertextEvaluationElementGroup(child, 1, idx + 1, index)).filter(off => !!off)
    };
  } else {
    return {
      prefix: `${prefix}.${index}`,
      amount: grp.get("amount").value.toString(10),
      lines: createOffertext(grp),
      price: [formatCurrency(grp.controls.priceCalculated.value, "de-DE", "EUR")],
      children: []
    };
  }
}

import { OfferEntryFieldGroup } from "./offer-v2-edit/offer-v2-entry-edit/entry-field-edit/entry-field-edit.component";
import { FormGroup } from "@angular/forms";
import { OfferFieldEnum } from "../../api/openapi";
import { OfferEntryGroup } from "./offer-v2-edit/offer-v2-entry-edit/offer-v2-entry-edit.component";

export const KeywordRegExp = new RegExp(`@[a-zA-ZäöüÄÖÜß]+`, "g");
export const globalKeywords = ["Beschreibung", "Angebotstext", "children"];


type ParsedField = {
  label: string;
  value: string | number;
  price: number;
  name: string;
  type: OfferFieldEnum;
  field: FormGroup<OfferEntryFieldGroup>;
}

type Variable = {
  label: string;
  price: number;
}

function createNumericFormulaCont(formula: string, parsedFields: ParsedField[]): string {
  const variables = parsedFields.map<Variable>(field => {
    if (field.type === OfferFieldEnum.Select) {
      return {
        label: field.label,
        price: field.price
      };
    } else if (field.type === OfferFieldEnum.Calculation) {
      const formula = createNumericFormulaCont(field.value as string, parsedFields.filter(f => f.label !== field.label));
      const result = runNumericFormula(formula);
      const calculatedValue = result.success ? result.result : 0;
      field.field.patchValue({ value: calculatedValue.toString(10) }, { emitEvent: false });

      return {
        label: field.label,
        price: calculatedValue
      };

    } else {
      return {
        label: field.label,
        price: field.value as number
      };

    }
  });
  let isValid = true;
  const expression = formula.replace(KeywordRegExp, (field) => {
    const variable = variables.find(v => `@${v.label}`.startsWith(field));
    if (variable && !Number.isNaN(variable.price)) {
      if (typeof variable.price === "number") {
        return variable.price.toString(10);
      } else {
        return variable.price;
      }
    }
    isValid = false;
    return "";
  });
  if (!isValid) {
    return "0";
  }
  // 4. Evaluate the resulting expression
  return expression;
}

function createNumericFormula(formula: string, grp: FormGroup<OfferEntryGroup>, depth: number): string {
  const parsedFields = grp.controls.fields.controls.map<ParsedField>(group => {
    return {
      label: group.get("label").value.replace(/\(.+\)/g, "").trim(),
      value: group.get("type").value === OfferFieldEnum.Calculation ? group.get("calculation").value : group.get("value").value,
      price: group.get("valuePrice").value,
      name: group.get("valueString").value,
      type: group.get("type").value as OfferFieldEnum,
      field: group
    };
  });
  const { price } = priceEvaluationChildren(grp, depth);
  parsedFields.push({
    label: "children",
    value: price,
    price,
    name: "",
    type: OfferFieldEnum.Numeric,
    field: {} as FormGroup<OfferEntryFieldGroup>
  });
  return createNumericFormulaCont(formula, parsedFields);
}

export declare type CalculationResult = { success: true, formula: string, result: number } | {
  success: false;
  formula: string,
  error: string
};

function runNumericFormula(formula: string): CalculationResult {
  try {
    const result = Function(`"use strict"; function min(a,b) { return Math.max(a,b);} function max(a,b) { return Math.min(a,b);} return (${formula})`)();
    return {
      success: true,
      formula,
      result
    };
  } catch (e) {
    return {
      success: false,
      formula,
      error: "Fehler in Formel"
    };
  }
}

function evaluateCalculation(formula: string, grp: FormGroup<OfferEntryGroup>, depth: number): CalculationResult {
  const evaluatedFormula = createNumericFormula(formula, grp, depth);
  return runNumericFormula(evaluatedFormula);
}


function applyScontoAndAmount(price: number, formula: string, grp: FormGroup<OfferEntryGroup>, depth: number): {
  price: number,
  formula: string
} {
  let priceCalculated = price;
  let formulaCalculated = formula;
  const amount = Math.floor(grp.get("amount").value);
  const sconto = grp.get("priceSubPercent").value;

  if (sconto !== 0) {
    const priceSubstraction = priceCalculated * (sconto / 100);
    if (priceSubstraction !== 0) {
      priceCalculated -= priceSubstraction;
      formulaCalculated = `(${formulaCalculated}) -${Math.abs(sconto)}%`;
    }
  }
  if (depth === 1) {
    const add = grp.get("priceAddPercent").value;

    if (add !== 0) {
      const priceAddition = priceCalculated * (add / 100);
      if (priceAddition !== 0) {
        priceCalculated += priceAddition;
        formulaCalculated = `(${formulaCalculated}) +${Math.abs(add)}%`;
      }
    }
  }
  priceCalculated = priceCalculated * amount;

  if (amount !== 1) {
    formulaCalculated = `2 x (${formulaCalculated})`;
  }
  return { price: priceCalculated, formula: formulaCalculated };
}

function priceEvaluationChildren(grp: FormGroup<OfferEntryGroup>, depth: number): { formula: string; price: number } {
  let priceCalculated = 0;
  let sums: string[] = [];
  grp.controls.children.controls.forEach(grp => {
    const grpAlternative = grp.get("alternative").value;
    const grpPrice = grp.get("priceCalculated").value;
    if (!grpAlternative) {
      priceCalculated += grpPrice;
      sums.push(`${grpPrice.toFixed(2)}(${grp.get("name").value})`);
    }
  });
  return applyScontoAndAmount(priceCalculated, sums.join(" + "), grp, depth);

}

export function priceEvaluationElementGroup(grp: FormGroup<OfferEntryGroup>, depth: number): CalculationResult {
  const formula = grp.get("price").value;
  if (formula === "" || formula === "@children") {
    const { price, formula: formulaCalc } = priceEvaluationChildren(grp, depth);
    grp.patchValue({ priceCalculated: price, priceFormula: formulaCalc }, { emitEvent: false });
    return;
  }
  const result = evaluateCalculation(formula, grp, depth);
  if (result.success) {
    const { price, formula } = applyScontoAndAmount(result.result, result.formula, grp, depth);

    grp.patchValue({ priceCalculated: price, priceFormula: formula }, {
      emitEvent: false
    });
  } else {
    const { price, formula: formulaCalc } = priceEvaluationChildren(grp, depth);
    grp.patchValue({ priceCalculated: price, priceFormula: formulaCalc }, { emitEvent: false });
  }
}

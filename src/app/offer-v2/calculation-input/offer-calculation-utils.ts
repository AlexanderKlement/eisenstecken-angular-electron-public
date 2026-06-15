import { OfferEntryFieldGroup } from "../offer-v2-edit/offer-v2-entry-edit/entry-field-edit/entry-field-edit.component";
import { FormArray, FormGroup } from "@angular/forms";
import { OfferFieldEnum } from "../../../api/openapi";
import { OfferEntryGroup } from "../offer-v2-edit/offer-v2-entry-edit/offer-v2-entry-edit.component";

export const nestingKeywords = ["children", "parent"];
export const KeywordRegExp = new RegExp(`@(?:(?:${nestingKeywords.join("|")})\\.)?[a-zA-ZäöüÄÖÜß]+`, "g");
export const globalKeywords = ["Beschreibung", "Angebotstext", ...nestingKeywords];


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
type OffertextVariable = {
  label: string;
  price: string;
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

function createNumericFormula(formula: string, fields: FormArray<FormGroup<OfferEntryFieldGroup>>): string {
  const parsedFields = fields.controls.map<ParsedField>(group => {
    return {
      label: group.get("label").value.replace(/\(.+\)/g, "").trim(),
      value: group.get("type").value === OfferFieldEnum.Calculation ? group.get("calculation").value : group.get("value").value,
      price: group.get("valuePrice").value,
      name: group.get("valueString").value,
      type: group.get("type").value as OfferFieldEnum,
      field: group
    };
  });
  return createNumericFormulaCont(formula, parsedFields);
}

export declare type CalculationResult = { success: true, formula: string, result: number } | {
  success: false;
  formula: string,
  error: string
};

function runNumericFormula(formula: string): CalculationResult {
  console.log({ formula });
  try {
    const result = Function(`"use strict"; return (${formula})`)();
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

function evaluateCalculation(formula: string, fields: FormArray<FormGroup<OfferEntryFieldGroup>>): CalculationResult {
  const evaluatedFormula = createNumericFormula(formula, fields);
  return runNumericFormula(evaluatedFormula);
}


function applySconto(price: number, formula: string, grp: FormGroup<OfferEntryGroup>): {
  price: number,
  formula: string
} {
  let priceCalculated = price;
  let formulaCalculated = formula;
  const sconto = grp.get("priceChangePercent").value;
  if (sconto !== 0) {
    const priceAddition = priceCalculated * (sconto / 100);
    if (priceAddition !== 0) {
      priceCalculated += priceAddition;
      formulaCalculated = `(${formulaCalculated}) ${sconto > 0 ? "+ " : "- "}${Math.abs(sconto)}%`;
    }
  }

  return { price: priceCalculated, formula: formulaCalculated };
}

function priceEvaluationChildren(grp: FormGroup<OfferEntryGroup>) {
  let priceCalculated = 0;
  let sums: string[] = [];
  grp.controls.children.controls.forEach(grp => {
    const grpPrice = grp.get("priceCalculated").value;
    priceCalculated += grpPrice;
    sums.push(`${grpPrice.toFixed(2)}(${grp.get("name").value})`);
  });
  const { price, formula } = applySconto(priceCalculated, sums.join(" + "), grp);
  grp.patchValue({ priceCalculated: price, priceFormula: formula }, { emitEvent: false });
}

export function priceEvaluationElementGroup(grp: FormGroup<OfferEntryGroup>) {
  const formula = grp.get("price").value;
  if (formula === "" || formula === "@children") {
    priceEvaluationChildren(grp);
    return;
  }
  const result = evaluateCalculation(formula, grp.controls.fields);
  console.log({ result });
  if (result.success) {
    const { price, formula } = applySconto(result.result, result.formula, grp);

    grp.patchValue({ priceCalculated: price, priceFormula: formula }, {
      emitEvent: false
    });
  } else {
    priceEvaluationChildren(grp);
  }
}


function createOffertextCont(formula: string, parsedFields: ParsedField[]): string {
  const variables = parsedFields.map<OffertextVariable>(field => {
    if (field.type === OfferFieldEnum.Select) {
      return {
        label: field.label,
        price: field.name
      };
    } else if (field.type === OfferFieldEnum.Calculation) {
      const formula = createNumericFormulaCont(field.value as string, parsedFields.filter(f => f.label !== field.label));
      const result = runNumericFormula(formula);
      const calculatedValue = result.success ? result.result : 0;
      field.field.patchValue({ value: calculatedValue.toString(10) }, { emitEvent: false });

      return {
        label: field.label,
        price: calculatedValue.toString(10)
      };

    } else {
      return {
        label: field.label,
        price: field.value.toString(10)
      };

    }
  });
  let isValid = true;
  const expression = formula.replace(KeywordRegExp, (field) => {
    const variable = variables.find(v => `@${v.label}`.startsWith(field));
    if (variable) {
      return variable.price;
    }
    isValid = false;
    return "";
  });
  if (!isValid) {
    return "";
  }
  // 4. Evaluate the resulting expression
  return expression;
}

function createOffertext(formula: string, fields: FormArray<FormGroup<OfferEntryFieldGroup>>): string {
  const parsedFields = fields.controls.map<ParsedField>(group => {
    return {
      label: group.get("label").value.replace(/\(.+\)/g, "").trim(),
      value: group.get("type").value === OfferFieldEnum.Calculation ? group.get("calculation").value : group.get("value").value,
      price: group.get("valuePrice").value,
      name: group.get("valueString").value,
      type: group.get("type").value as OfferFieldEnum,
      field: group
    };
  });
  return createOffertextCont(formula, parsedFields);
}

function offertextEvaluationChildren(grp: FormGroup<OfferEntryGroup>) {
  let offertextCalculated = "";
  grp.controls.children.controls.forEach(grp => {
    const grpOffertext = grp.get("offertextCalculated").value;
    offertextCalculated = `${offertextCalculated}\n${grpOffertext}`;
  });
  console.log({ offertextCalculated });
  grp.patchValue({ offertextCalculated }, { emitEvent: false });
}

type Offertext = {
  prefix: string;
  amount: string;
  lines: string;
  price: string;
}

export function offertextEvaluationElementGroup(grp: FormGroup<OfferEntryGroup>, depth: number, index: number): Offertext {
  const formula = grp.get("offertext").value;
  if (depth === 0) {
// TODO do wori
    return;
  } else {
    const result = createOffertext(formula, grp.controls.fields);
    console.log({ offertext: result });
    grp.patchValue({ offertextCalculated: result }, {
      emitEvent: false
    });
  }
}

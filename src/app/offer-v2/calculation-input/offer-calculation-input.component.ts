import { booleanAttribute, Component, ElementRef, inject, Input, OnInit, ViewChild } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DefaultFlexDirective, DefaultLayoutDirective, DefaultLayoutGapDirective } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { OfferField, OfferV2Service } from "../../../api/openapi";
import { take } from "rxjs/operators";
import { MatFormField, MatHint, MatInput, MatLabel } from "@angular/material/input";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";

type HighlightedText = {
  key: string;
  value: string;
  highlighted: boolean;
  warn: boolean;
  hasNewline: boolean;
}

type SearchTerm = {
  pos: number;
  hasAt: boolean;
  key: string;
  valid: boolean;
  original: string;
}
const nestingKeywords = ["children", "parent"];
// Matches @Feldname, @children.Feldname, @parent.Feldname
const KeywordRegExp = new RegExp(`@(?:(?:${nestingKeywords.join("|")})\\.)?[a-zA-ZäöüÄÖÜß]+`, "g");
const globalKeywords = ["Beschreibung", "Angebotstext", ...nestingKeywords];
@Component({
  selector: "app-offer-calculation-input",
  templateUrl: "./offer-calculation-input.component.html",
  styleUrls: ["./offer-calculation-input.component.scss"],
  imports: [
    ReactiveFormsModule,
    DefaultFlexDirective,
    DefaultLayoutDirective,
    DefaultLayoutGapDirective,
    MatButton,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    CdkTextareaAutosize
  ]
})
export default class OfferCalculationInputComponent implements OnInit {

  private offerService = inject(OfferV2Service);
  @ViewChild("calculationInput") calculationInput: ElementRef<HTMLTextAreaElement>;
  @ViewChild("highlightsContainer") highlightsContainer: ElementRef<HTMLDivElement>;
  @Input() value: string;
  @Input() label: string;
  @Input() setValue: (val: string) => void;
  @Input() hintStyle: "big" | "small" | "offertext";
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input() filterFields: OfferField[];
  parts: HighlightedText[] = [];
  private fields: string[] = globalKeywords;
  private maxLength = Math.max(...globalKeywords.map(f => f.length));
  displayFields: string[] | null;

  ngOnInit(): void {
    this.offerService.getOfferFieldsOfferV2FieldsGet().pipe(take(1)).subscribe((data) => {
      this.fields = globalKeywords.concat(data.map(d => d.label)).filter((k, idx, arr) => arr.indexOf(k) === idx);
      this.maxLength = Math.max(...this.fields.map(f => f.length));
      this.sync();
    });

  }

  getSearchTerm(value: string, cursorPos: number, count: number): SearchTerm {
    if (count > cursorPos) {
      return this.getSearchTerm(value, cursorPos, count - 1);
    }
    const substr = value.substring(cursorPos - count, cursorPos);
    if (/[^a-zA-ZäöüÄÖÜß@]/.test(substr)) {
      return this.getSearchTerm(value, cursorPos, count - 1);
    }
    const key = substr.replace("@", "");
    return {
      pos: cursorPos - count,
      hasAt: substr.includes("@"),
      key,
      valid: key.length !== 0,
      original: substr
    };
  }

  onCalculationKeyUp(): void {
    const val = this.calculationInput.nativeElement.value;
    this.setValue(val);
    const cursorPos = this.calculationInput.nativeElement.selectionStart;
    this.sync();
    if (!val) {
      this.displayFields = null;
      return;
    }
    const searchTerm = this.getSearchTerm(val, cursorPos, this.maxLength);
    const key = searchTerm.key.toLowerCase();
    if (searchTerm.valid) {
      this.displayFields = this.fields.filter(field => field.toLowerCase().startsWith(key));
    } else {
      this.displayFields = null;
    }

  }

  onFieldClick(field: string) {
    const val = this.calculationInput.nativeElement.value;
    const cursorPos = this.calculationInput.nativeElement.selectionStart;
    if (!val)
      return;
    const searchTerm = this.getSearchTerm(val, cursorPos, this.maxLength);
    const firstPart = val.substring(0, searchTerm.pos);
    const secondPart = val.substring(searchTerm.pos + searchTerm.original.length);
    const suffix = nestingKeywords.includes(field) ? "." : "";
    const firstPartEndsWithNesting = nestingKeywords.reduce((prev, cur) => prev || firstPart.endsWith(`${cur}.`), false);
    const prefix = firstPartEndsWithNesting ? "" : "@";
    console.log({ firstPart, secondPart, firstPartEndsWithNesting, prefix, suffix });
    const newVal = firstPart + prefix + field + suffix + secondPart;
    this.setValue(newVal);
    this.calculationInput.nativeElement.value = newVal;
    this.calculationInput.nativeElement.focus();
    this.sync();
  }

  sync() {
    const text = this.calculationInput.nativeElement.value;
    this.highlightsContainer.nativeElement.style.top = this.calculationInput.nativeElement.offsetTop + "px";
    this.highlightsContainer.nativeElement.style.left = this.calculationInput.nativeElement.offsetLeft + "px";
    this.highlightsContainer.nativeElement.style.height = this.calculationInput.nativeElement.clientHeight + "px";
    this.highlightsContainer.nativeElement.style.width = this.calculationInput.nativeElement.clientWidth + "px";
    const matches = text.matchAll(KeywordRegExp);
    this.parts = [];
    let match = matches.next();
    let lastIdx = 0;
    while (!match.done) {
      const txt = match.value[0];
      const field = this.fields.find(field => `@${field}` === txt || nestingKeywords.reduce((prev, cur) => prev || `@${cur}.${field}` === txt, false));
      if (field) {
        if (match.value.index !== 0) {
          const value = text.substring(lastIdx, match.value.index);
          this.parts.push({
            key: `${txt}-${lastIdx}-${match.value.index}`,
            value,
            highlighted: false,
            warn: false,
            hasNewline: value.includes("\n")
          });
        }
        this.parts.push({
          key: `${txt}-${match.value.index}`,
          value: txt,
          highlighted: true,
          warn: globalKeywords.find(f => `@${f}` === txt || nestingKeywords.reduce((prev, cur) => prev || `@${cur}.${f}` === txt, false)) ? false : this.filterFields ? !this.filterFields.find(f => `@${f.label}` === txt) : false,
          hasNewline: false
        });
        lastIdx = match.value.index + txt.length;
      }
      match = matches.next();
    }
  }
}

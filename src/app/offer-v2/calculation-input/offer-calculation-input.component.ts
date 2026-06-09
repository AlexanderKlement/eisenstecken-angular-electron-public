import { Component, ElementRef, inject, Input, OnInit, ViewChild } from "@angular/core";
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
}

type SearchTerm = {
  pos: number;
  hasAt: boolean;
  key: string;
  valid: boolean;
  original: string;
}

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
  @Input() filterFields: OfferField[];
  parts: HighlightedText[] = [];
  private fields: string[];
  private maxLength = 0;
  displayFields: string[] | null;

  ngOnInit(): void {
    this.offerService.getOfferFieldsOfferV2FieldsGet().pipe(take(1)).subscribe((data) => {
      this.fields = data.map(d => d.label);
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
    if (this.fields) {
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
  }

  onFieldClick(field: string) {
    const val = this.calculationInput.nativeElement.value;
    const cursorPos = this.calculationInput.nativeElement.selectionStart;
    if (!val)
      return;
    const searchTerm = this.getSearchTerm(val, cursorPos, this.maxLength);
    const firstPart = val.substring(0, searchTerm.pos);
    const secondPart = val.substring(searchTerm.pos + searchTerm.original.length);
    const newVal = firstPart + `${firstPart.at(-1) === " " || searchTerm.pos === 0 ? "" : " "}@${field}${secondPart.startsWith(" ") ? "" : " "}` + secondPart;
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
    const parts = text.split(" ").reduce((prev, cur) => [...prev, cur, " "], []);
    console.log({ text, parts });
    if (this.fields) {
      this.parts = parts.map((txt, index) => {
        const highlighted = !!this.fields.find(field => `@${field}` === txt);
        return {
          key: `${txt}-${index}`,
          value: txt,
          highlighted,
          warn: this.filterFields ? !this.filterFields.find(f => `@${f.label}` === txt) : false
        };
      });
    }
  }
}

import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { DefaultService, GenderEnum, OfferV2EntryOutput, OfferV2WithVersion, Parameter } from "../../../../api/openapi";
import { BehaviorSubject } from "rxjs";
import { AsyncPipe, formatCurrency, NgOptimizedImage } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import dayjs from "dayjs/esm";
import { SplitTextNewlinePipe } from "../../../shared/pipes/common";

export interface OfferPreviewData {
  offer: OfferV2WithVersion;
  parameters: Parameter[];
}

type PdfRow = {
  text: string;
  subText: string;
  prefix: string;
  amount: number;
  price: number;
  isBold: boolean;
}

@Component({
  selector: "offer-v2-preview-dialog",
  templateUrl: "./offer-v2-preview-dialog.component.html",
  styleUrls: ["./offer-v2-preview-dialog.component.scss"],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    AsyncPipe,
    FlexModule,
    MatButton,
    MatProgressSpinner,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    NgOptimizedImage,
    SplitTextNewlinePipe
  ]
})
export default class OfferV2PreviewDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<OfferV2PreviewDialogComponent>>(MatDialogRef);
  data = inject<OfferPreviewData>(MAT_DIALOG_DATA);
  api = inject(DefaultService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  pages = 2;
  first_page_text = "";
  footer_text = "";
  position = "";
  name = "";
  material_desc_title = "";
  material_desc_body = "";
  rows: PdfRow[] = [];
  now = dayjs().format("DD.MM.YYYY");
  private scale = 4.7619;

  protected mm(val: number) {
    return val * this.scale;
  }

  parseRow(row: OfferV2EntryOutput, depth: number, prefix: string): string {
    if (depth === 0) {
      this.rows.push({
        amount: row.amount,
        price: 1,
        prefix,
        text: row.offertext,
        subText: "",
        isBold: true
      });
      row.children.forEach((item, index) => {
        this.parseRow(item, 1, `${prefix}.${index + 1}`);
      });
      return "";
    } else if (depth === 1) {
      let subTxt = "";
      row.children.forEach((item) => {
        subTxt += this.parseRow(item, 2, "");
      });
      this.rows.push({
        amount: row.amount,
        price: 1,
        prefix,
        text: row.offertext,
        subText: subTxt,
        isBold: false
      });
      return "";
    } else {
      let subTxt = row.offertext;
      row.children.forEach((item) => {
        subTxt += this.parseRow(item, 2, "");
      });
      return subTxt;
    }
  }

  ngOnInit(): void {
    const client = this.data.offer.job.client;
    const content = this.data.offer.content;
    if (content) {
      content.forEach((item, index) => {
        this.parseRow(item, 0, `${index + 1}`);
      });
    }
    this.material_desc_title = this.data.offer.materialDescriptionTitle;
    this.material_desc_body = this.data.offer.materialDescription;
    let salutation = "";
    if (client.isCompany && client.language.code == "DE")
      salutation = "Sehr geehrte Damen und Herren";
    else if (client.isCompany && client.language.code == "IT")
      salutation = "Signore e signori";
    else if (client.gender.code == "M" && client.language.code == "DE")
      salutation = "Sehr geehrter Herr " + client.lastname;
    else if (client.gender.code == "F" && client.language.code == "DE")
      salutation = "Sehr geehrte Frau " + client.lastname;
    else if (client.gender.code == "M" && client.language.code == "IT")
      salutation = "Caro signor " + client.lastname;
    else if (client.gender.code == "F" && client.language.code == "IT")
      salutation = "Gentile signora " + client.lastname;
    this.data.parameters.forEach(parameter => {
      const lang = this.data.offer.job.client.language.code.toLowerCase();
      if (parameter.key === `offer_title_introduction_${lang}`) {
        this.first_page_text = parameter.value.replace("[ANREDE]", salutation);
      }
      if (parameter.key === `offer_footer_${lang}`) {
        this.footer_text = parameter.value;
      }
      if (parameter.key === `offer_position_${lang}`) {
        this.position = parameter.value;
      }
      if (parameter.key === `offer_name_${lang}`) {
        this.name = parameter.value;
      }
    });
  }


  onCloseClick(): void {
    this.dialogRef.close();
  }

  protected readonly dayjs = dayjs;
  protected readonly GenderEnum = GenderEnum;
  protected readonly formatCurrency = formatCurrency;
}

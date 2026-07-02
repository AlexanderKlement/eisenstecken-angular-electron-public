import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import {
  DefaultService,
  OfferV2EntryOutput,
  OfferV2PdfBody,
  OfferV2Service,
  OfferV2WithVersion,
  Parameter
} from "../../../../api/openapi";
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
import { take } from "rxjs/operators";

export interface OfferPreviewData {
  offer: OfferV2WithVersion;
  parameters: Parameter[];
}

type PdfRow = {
  text: string[];
  prefix: string;
  amount: number;
  price: number;
  type: "title" | "normal" | "alternative" | "sconto" | "alternative-title";
}
type RowHeight = { isTitle: boolean, height: number };

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
    NgOptimizedImage
  ]
})
export default class OfferV2PreviewDialogComponent implements OnInit, AfterViewInit {
  dialogRef = inject<MatDialogRef<OfferV2PreviewDialogComponent>>(MatDialogRef);
  data = inject<OfferPreviewData>(MAT_DIALOG_DATA);
  api = inject(DefaultService);
  offerService = inject(OfferV2Service);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  isPrinting = false;
  pages = 2;
  total: number = 0;
  sconto: number = 0;
  totalSconted: number = 0;
  vatPercent: number = 0;
  vat: number = 0;
  totalBrutto: number = 0;
  first_page_text = "";
  footer_text = "";
  position = "";
  name = "";
  material_desc_title = "";
  material_desc_body = "";
  offerTableMeasurements: RowHeight[][] = [];
  rows: PdfRow[] = [];
  @ViewChild("secondOfferTable") secondOfferTable: ElementRef<HTMLDivElement>;
  @ViewChild("firstOfferTable") firstOfferTable: ElementRef<HTMLDivElement>;
  @ViewChild("firstContent") firstContent: ElementRef<HTMLDivElement>;
  @ViewChild("secondContent") secondContent: ElementRef<HTMLDivElement>;
  @ViewChild("container") container: ElementRef<HTMLDivElement>;
  now = dayjs().format("DD.MM.YYYY");
  private scale = 4.7619;

  protected mm(val: number) {
    return val * this.scale;
  }

  ngAfterViewInit() {
    const rowHeights: RowHeight[] = [];
    let headerHeight: number = 0;
    let spacerHeight: number = 0;
    const firstContentOffset = this.firstContent.nativeElement.offsetTop;
    const firstOffset = this.firstOfferTable.nativeElement.offsetTop;
    const secondOffset = this.secondOfferTable.nativeElement.offsetTop;
    const secondContentOffset = this.secondContent.nativeElement.offsetTop;
    this.firstOfferTable.nativeElement.childNodes.forEach(child => {
      if (child.nodeName === "DIV") {
        const row: HTMLDivElement = child as HTMLDivElement;
        if (row.classList.contains("row--head")) {
          headerHeight = row.offsetHeight;
        } else if (row.classList.contains("row--spacer")) {
          spacerHeight = row.offsetHeight;
        } else {
          rowHeights.push({ height: row.offsetHeight, isTitle: row.classList.contains("row--section") });
        }
      }
    });
    const pageHeight = this.mm(272); // 297 - footer(25mm)
    const firstSpace = pageHeight - firstContentOffset - firstOffset - headerHeight - spacerHeight;
    const secondSpace = pageHeight - secondContentOffset - secondOffset - headerHeight - spacerHeight;
    const rowDistribution: RowHeight[][] = [[]];
    let availableSpace = firstSpace;
    rowHeights.forEach((rowHeight, index) => {
      let height = rowHeight.height;
      let totalHeight = height;
      if (rowHeight.isTitle) {
        height += this.mm(3);
        totalHeight = height;
        if (rowHeights.length > index + 1) {
          height += rowHeights[index + 1].height;
        }
      }
      if (availableSpace - height < 0) {
        rowDistribution.push([]);
        availableSpace = secondSpace;
      }
      rowDistribution[rowDistribution.length - 1].push(rowHeight);
      availableSpace -= totalHeight;
    });
    this.offerTableMeasurements = rowDistribution;
    this.pages = rowDistribution.length + 1;
  }

  async extractNodeWithStyles() {
    const clone = this.container.nativeElement.cloneNode(true);
    const images = (clone as HTMLDivElement).querySelectorAll("img");
    await Promise.all(Array.from(images).map(async (img: HTMLImageElement) => {
      const response = await fetch(img.src, { credentials: "include" }); // sends cookies/session
      const blob = await response.blob();
      img.src = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.toString());
        reader.readAsDataURL(blob);
      });
    }));
    // Collect every CSS rule that could apply to this node or its descendants
    const relevantCSS = [];
    for (const sheet of document.styleSheets) {
      let rules;
      try {
        rules = sheet.cssRules; // throws for cross-origin stylesheets
      } catch (e) {
        console.warn("Skipping inaccessible stylesheet:", sheet.href);
        continue;
      }
      for (const rule of rules) {
        if (rule.selectorText) {
          try {
            if (this.container.nativeElement.matches(rule.selectorText) || this.container.nativeElement.querySelector(rule.selectorText)) {
              relevantCSS.push(rule.cssText);
            }
          } catch (e) {
            // invalid selector for matches(), skip
          }
        } else {
          // @font-face, @media, @keyframes etc — safest to include as-is
          relevantCSS.push(rule.cssText);
        }
      }
    }
    relevantCSS.push(`body{ margin: 0!important; padding: 0!important; width: ${this.mm(210)}px!important;}`);
    relevantCSS.push(`.viewer.print{ max-height: ${this.mm((297 * (this.pages + 1))) - 2}px!important; overflow: hidden!important;}`);
    return {
      html: (clone as HTMLDivElement).outerHTML,
      css: relevantCSS.join(" ")
    } as OfferV2PdfBody;
  }

  onGeneratePdf() {
    this.isPrinting = true;
    this.loadingSubject.next(true);
    setTimeout(() => {
      this.extractNodeWithStyles().then((payload) => {
        this.offerService.generatePdfOfferV2OfferPdfOfferIdPost(this.data.offer.id, payload).pipe(take(1)).subscribe((offer) => {
          this.loadingSubject.next(false);
          this.isPrinting = false;
        });
      });
    }, 200);
  }

  parseRow(row: OfferV2EntryOutput, depth: number, prefix: string) {
    if (depth === 0) {
      if (!row.alternative) {
        this.total += (row.singlePriceEvaluated * row.amount);
      }
      const sconto = -1 * (row.singlePriceEvaluated * row.amount) * (row.priceSubPercent / 100);
      this.rows.push({
        amount: row.amount,
        price: row.singlePriceEvaluated - sconto,
        prefix: `${prefix}.0`,
        text: row.offertextEvaluated,
        type: row.alternative ? "alternative-title" : "title"
      });
      let alternatives = 0;
      row.children.forEach((item, index) => {
        if (item.alternative) {
          alternatives++;
        }
        this.parseRow(item, 1, `${prefix}.${index - alternatives + 1}`);
      });
      if (sconto !== 0) {
        this.rows.push({
          amount: 1,
          type: "sconto",
          text: [`Sconto ${row.priceSubPercent.toFixed(2)} %`],
          prefix,
          price: sconto
        });
        this.total += sconto;
      }
    } else if (depth === 1) {
      const sconto = -1 * (row.singlePriceEvaluated * row.amount) * (row.priceSubPercent / 100);
      this.rows.push({
        amount: row.amount,
        price: row.singlePriceEvaluated - sconto,
        prefix,
        text: row.offertextEvaluated,
        type: row.alternative ? "alternative" : "normal"
      });
      if (sconto !== 0) {
        this.rows.push({
          amount: 1,
          type: "sconto",
          text: [`Sconto ${row.priceSubPercent.toFixed(2)} %`],
          prefix,
          price: sconto
        });
      }
    }
  }

  ngOnInit(): void {
    const client = this.data.offer.job.client;
    const content = this.data.offer.content;
    if (content) {
      let alternatives = 0;
      content.filter(c => c.visibleOffer).forEach((item, index) => {
        if (item.alternative) {
          alternatives++;
        }
        this.parseRow(item, 0, `${index - alternatives + 1}`);
      });
      this.sconto = this.data.offer.globalSubPercent;
      this.totalSconted = this.total - (this.total * (this.sconto / 100));
      if (this.data.offer.vat) {
        this.vatPercent = this.data.offer.vat.amount;
        this.vat = (this.vatPercent / 100) * this.totalSconted;
        this.totalBrutto = this.totalSconted + this.vat;
      }
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
  protected readonly formatCurrency = formatCurrency;
}

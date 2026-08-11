import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import {
  DefaultService,
  OfferStatementEntryEntry,
  OfferStatementEntryInput,
  OfferV2EntryOutput,
  OfferV2PdfBody,
  OfferV2Service,
  OfferV2WithVersion,
  Parameter
} from "../../../../api/openapi";
import { BehaviorSubject } from "rxjs";
import { AsyncPipe, formatCurrency } from "@angular/common";
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
import { LocalConfigRenderer } from "../../../LocalConfigRenderer";
import {
  OfferV2PreviewStaticContentComponent
} from "./offer-v2-preview-static-content/offer-v2-preview-static-content.component";

export interface OfferPreviewData {
  offer: OfferV2WithVersion;
  statement?: {
    id: number;
    date: string;
    content: OfferStatementEntryInput[]
  };
  parameters: Parameter[];
}

type PdfStatement = {
  additionSubstraction: boolean
  text: string;
  price: number;
  amount: number;
}

function mapStatementEntry(entry: OfferStatementEntryEntry): PdfStatement {
  return {
    additionSubstraction: entry.additionSubstraction,
    text: entry.description,
    price: entry.price,
    amount: entry.amount
  };
}


type PdfRow = {
  text: string[];
  prefix: string;
  amount: number;
  price: number;
  type: "title" | "normal" | "alternative" | "sconto" | "alternative-title";
  notMade: boolean;
  statements: PdfStatement[];
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
    OfferV2PreviewStaticContentComponent,
    OfferV2PreviewStaticContentComponent
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
  isStatement = false;
  pages = 2;
  total: number = 0;
  sconto: number = 0;
  scontoAmount: number = 0;
  totalSconted: number = 0;
  vatPercent: number = 0;
  vat: number = 0;
  totalBrutto: number = 0;
  first_page_text = "";
  footer_text = "";
  position = "";
  closingLogos: string | null = null;
  name = "";
  material_desc_title = "";
  material_desc_body = "";
  labels = {
    number: "Nummer",
    inPriceIncluded: "Im Gesamtbetrag enthalten: ",
    validity: "Gültigkeit des Angebotes: ",
    delivery: "Lieferung: ",
    payment: "Zahlung: ",
    mfg: "Mit freundlichen Grüßen",
    offer: "Angebot",
    date: "Datum",
    page: "Seite",
    client: "Kunde",
    vatNumber: "MwSt.-Nr.",
    fiscalCode: "St.-Nr.",
    position: "Position",
    description: "Beschreibung",
    quantity: "Menge",
    singlePrice: "Einzelpreis",
    totalPrice: "Gesamtpreis",
    sumNet: "Gesamtsumme ohne MwSt.",
    sumSconto: "Gesamtsumme abzgl. Skonto:",
    vatAmount: "MwSt.-Betrag",
    totalGross: "Gesamtbetrag",
    onAcceptance: "Bei Annahme",
    place: "Ort",
    signature: "Unterschrift",
    feldthurns: "Feldthurns, den"
  };
  offerTableMeasurements: RowHeight[][] = [[]];
  rows: PdfRow[] = [];
  @ViewChild("startOfferTable") startOfferTable: ElementRef<HTMLDivElement>;
  @ViewChild("offerTableContent") offerTableContent: ElementRef<HTMLDivElement>;
  @ViewChild("container") container: ElementRef<HTMLDivElement>;
  now = dayjs().format("DD.MM.YYYY");
  private scale = 4.7619;

  protected mm(val: number) {
    return val * this.scale;
  }

  protected currentPage(idx: number): number {
    if (this.data.statement) {
      return idx + 1;
    }
    return idx + (this.material_desc_body === "" ? 1 : 2);
  }

  ngAfterViewInit() {
    const rowHeights: RowHeight[] = [];
    let headerHeight: number = 0;
    let spacerHeight: number = 0;
    const secondOffset = this.startOfferTable.nativeElement.offsetTop;
    const secondContentOffset = this.offerTableContent.nativeElement.offsetTop;
    let statements = 0;
    this.startOfferTable.nativeElement.childNodes.forEach(child => {
      if (child.nodeName === "DIV") {
        const row: HTMLDivElement = child as HTMLDivElement;
        console.log({ class: row.className, idx: row.ariaRowIndex });
        if (row.classList.contains("row--head")) {
          headerHeight = row.offsetHeight;
        } else if (row.classList.contains("row--spacer")) {
          spacerHeight = row.offsetHeight;
        } else {
          if (statements === 0) {
            const rowIdx = parseInt(row.ariaRowIndex, 10);
            if (!Number.isNaN(rowIdx)) {
              statements = rowIdx;
            }
            rowHeights.push({ height: row.offsetHeight, isTitle: row.classList.contains("row--section") });
          } else {
            statements--;
            rowHeights.at(rowHeights.length - 1).height += row.offsetHeight;
          }
        }
      }
    });
    const pageHeight = this.mm(267); // 297 - footer(25mm) - padding(5mm)
    const secondSpace = pageHeight - secondContentOffset - secondOffset - headerHeight - spacerHeight;
    const rowDistribution: RowHeight[][] = [[]];
    let availableSpace = secondSpace;
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
    console.log(this.offerTableMeasurements);
    this.pages = this.material_desc_body === "" || this.isStatement ? rowDistribution.length : rowDistribution.length + 1;
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
    relevantCSS.push(`.viewer.print{ max-height: ${this.mm((297 * (this.pages + (this.isStatement ? 1 : 2)))) - 2}px!important; overflow: hidden!important;}`);
    return {
      html: (clone as HTMLDivElement).outerHTML,
      css: relevantCSS.join(" ")
    } as OfferV2PdfBody;
  }

  onGeneratePdf() {
    if (!this.data.statement && this.data.offer.id === -1)
      return;
    this.isPrinting = true;
    this.loadingSubject.next(true);
    setTimeout(() => {
      this.extractNodeWithStyles().then((payload) => {
        if (this.data.statement) {
          this.offerService.generateStatementPdfOfferV2StatementPdfStatementIdPost(this.data.statement.id, payload).pipe(take(1)).subscribe(() => {
            this.loadingSubject.next(false);
            this.isPrinting = false;
          });
        } else {
          this.offerService.generatePdfOfferV2OfferPdfOfferIdPost(this.data.offer.id, payload).pipe(take(1)).subscribe(() => {
            this.loadingSubject.next(false);
            this.isPrinting = false;
          });
        }
      });
    }, 200);
  }

  parseRow(row: OfferV2EntryOutput, depth: number, prefix: string, statementEntry?: OfferStatementEntryInput) {
    if (depth > 1)
      return;
    let singlePrice = statementEntry?.notMade ? 0 : row.singlePriceEvaluated;
    let childStatementPriceDiff = statementEntry ? statementEntry.children.reduce<number>((prev, cur) => {
      if (cur.notMade)
        return prev - cur.originalPrice;
      let curDiff = 0;
      cur.entries.forEach((entry) => {
        if (entry.additionSubstraction) {
          curDiff += (entry.price * entry.amount);
        } else {
          curDiff -= (entry.price * entry.amount);
        }
      });
      return prev + curDiff;
    }, 0) : 0;
    singlePrice += childStatementPriceDiff;
    const statements = statementEntry && !statementEntry.notMade ? statementEntry.entries.map(mapStatementEntry) : [];
    statements.forEach(statement => {
      if (statement.additionSubstraction) {
        singlePrice += (statement.price * statement.amount);
      } else {
        singlePrice -= (statement.price * statement.amount);
      }
    });
    if (depth === 0) {
      if (!row.alternative) {
        this.total += singlePrice;
      }
      this.rows.push({
        amount: 1,
        price: row.singlePriceEvaluated + childStatementPriceDiff,
        prefix: `${prefix}.0`,
        text: row.offertextEvaluated,
        type: row.alternative ? "alternative-title" : "title",
        notMade: statementEntry ? statementEntry.notMade : false,
        statements
      });
      this.offerTableMeasurements[0].push({ height: 1, isTitle: false });
      let alternatives = 0;
      row.children.forEach((item, index) => {
        if (item.alternative) {
          alternatives++;
        }
        this.parseRow(item, 1, `${prefix}.${index - alternatives + 1}`, statementEntry ? statementEntry.children.at(index) : undefined);
      });
      const sconto = -1 * (row.singlePriceEvaluated * row.amount) * (row.priceSubPercent / 100);
      if (sconto !== 0) {
        this.rows.push({
          amount: 1,
          type: "sconto",
          text: [`Sconto ${row.priceSubPercent.toFixed(2)} %`],
          prefix: "",
          price: sconto,
          notMade: false,
          statements: []
        });
        this.offerTableMeasurements[0].push({ height: 1, isTitle: false });

        this.total += sconto;
      }
    } else if (depth === 1) {
      this.rows.push({
        amount: row.amount,
        price: row.singlePriceEvaluated,
        prefix,
        text: row.offertextEvaluated,
        type: row.alternative ? "alternative" : "normal",
        notMade: statementEntry ? statementEntry.notMade : false,
        statements
      });
      this.offerTableMeasurements[0].push({ height: 1, isTitle: false });

      const sconto = -1 * (row.singlePriceEvaluated * row.amount) * (row.priceSubPercent / 100);
      if (sconto !== 0) {
        this.rows.push({
          amount: 1,
          type: "sconto",
          text: [`Sconto ${row.priceSubPercent.toFixed(2)} %`],
          prefix,
          price: sconto,
          notMade: false,
          statements: []
        });
        this.offerTableMeasurements[0].push({ height: 1, isTitle: false });

      }
    }
  }

  ngOnInit(): void {
    this.isStatement = !!this.data.statement;
    this.closingLogos = LocalConfigRenderer.getInstance().getApi() + "/parameter/offer_extra_logos/image";
    const client = this.data.offer.job.client;
    const content = this.data.offer.content;
    if (content) {
      let alternatives = 0;
      content.filter(c => c.visibleOffer).forEach((item, index) => {
        if (item.alternative) {
          alternatives++;
        }
        this.parseRow(item, 0, `${index - alternatives + 1}`, this.isStatement ? this.data.statement.content.at(index) : undefined);
      });
      this.sconto = this.data.offer.globalSubPercent;
      this.scontoAmount = this.data.offer.globalPriceDiff;
      this.totalSconted = (this.total - (this.total * (this.sconto / 100))) - this.scontoAmount;
      if (this.data.offer.vat) {
        this.vatPercent = this.data.offer.vat.amount;
        this.vat = this.totalSconted * this.data.offer.vat.multiplier;
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
    const lang = this.data.offer.job.client.language.code.toLowerCase();
    if (lang === "de") {
      this.labels = {
        number: "Nummer",
        inPriceIncluded: "Im Gesamtbetrag enthalten: ",
        validity: "Gültigkeit des Angebotes: ",
        delivery: "Lieferung: ",
        payment: "Zahlung: ",
        mfg: "Mit freundlichen Grüßen",
        offer: this.isStatement ? "Aufstellung" : "Angebot",
        date: "Datum",
        page: "Seite",
        client: "Kunde",
        vatNumber: "MwSt.-Nr.",
        fiscalCode: "St.-Nr.",
        position: "Position",
        description: "Beschreibung",
        quantity: "Menge",
        singlePrice: "Einzelpreis",
        totalPrice: "Gesamtpreis",
        sumNet: "Gesamtsumme ohne MwSt.",
        sumSconto: `Gesamtsumme abzgl. Skonto${this.scontoAmount !== 0 ? " und Abrundung" : `: ${this.sconto.toFixed(2)}%`}`,
        vatAmount: "MwSt.-Betrag",
        totalGross: "Gesamtbetrag",
        onAcceptance: "Bei Annahme",
        place: "Ort",
        signature: "Unterschrift",
        feldthurns: "Feldthurns, den"
      };
    } else {
      this.labels = {
        number: "Numero",
        date: "Data",
        page: "Pagina",
        client: "Cliente",
        mfg: "Cordiali saluti",
        payment: "Pagamento: ",
        inPriceIncluded: "Incluso nell'importo totale: ",
        delivery: "Consegna: ",
        validity: "Validità dell'offerta: ",
        offer: this.isStatement ? "Riepilogo" : "Offerta",
        vatNumber: "Part. IVA",
        fiscalCode: "Cod. fisc.",
        position: "Posizione",
        description: "Descrizione",
        quantity: "Quantità",
        singlePrice: "Prezzo cad.",
        totalPrice: "Prezzo tot.",
        sumNet: "Totale escluso IVA",
        sumSconto: `Totale escluso sconto: ${this.scontoAmount !== 0 ? " ed arrotondamento" : `: ${this.sconto.toFixed(2)}%`}`,
        vatAmount: "Importo IVA",
        totalGross: "Importo totale",
        onAcceptance: "All'accettazione",
        place: "Luogo",
        signature: "Firma",
        feldthurns: "Velturno, il"
      };
    }
    this.data.parameters.forEach(parameter => {

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

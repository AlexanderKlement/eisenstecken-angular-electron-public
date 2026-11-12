import { Component, DEFAULT_CURRENCY_CODE, inject, LOCALE_ID, OnDestroy, OnInit } from "@angular/core";
import { AsyncPipe, CurrencyPipe, formatCurrency, Location } from "@angular/common";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { Observable } from "rxjs";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup
} from "@angular/forms";
import { distinctUntilChanged, first, map, shareReplay, switchMap, tap } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { AuthStateService } from "../../shared/services/auth-state.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import dayjs from "dayjs/esm";
import { formatDateTransport } from "../../shared/date.util";
import { FileService } from "../../shared/services/file.service";
import {
  Client,
  Country,
  DescriptiveArticle,
  DescriptiveArticleCreate,
  Lock,
  OutgoingInvoice,
  OutgoingInvoiceCreate,
  OutgoingInvoiceUpdate,
  PaymentTermEnum,
  ReceivableInstallment,
  ScopeEnum,
  Vat
} from "../../../api/openapi";
import { DefaultFlexDirective, DefaultLayoutAlignDirective, DefaultLayoutDirective, FlexModule } from "ng-flex-layout";
import { MatButton, MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatError, MatFormField, MatInput, MatLabel, MatSuffix } from "@angular/material/input";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatOption, MatSelect, MatSelectChange } from "@angular/material/select";
import { MatCheckbox } from "@angular/material/checkbox";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { PAYMENT_TERMS } from "../../invoice/payment_terms";
import { ReceivableGroup } from "../../invoice/outgoing/outgoing-payment-dialog/outgoing-payment-dialog.component";

type PaymentTermsResolved = { label: string; daysToAdd: number };

/** Rounds to cents, symmetric for negative values (invoices / receivables can be negative). */
function roundCents(value: number): number {
  return Math.sign(value) * Math.round(Math.abs(value) * 100) / 100;
}


@Component({
  selector: "app-outgoing-invoice-edit",
  templateUrl: "./outgoing-invoice-edit.component.html",
  styleUrls: ["./outgoing-invoice-edit.component.scss"],
  imports: [
    ToolbarComponent,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexDirective,
    FlexModule,
    MatIconButton,
    MatButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatSelect,
    MatOption,
    MatCheckbox,
    AsyncPipe,
    CircleIconButtonComponent,
    MatError
  ]
})
export default class OutgoingInvoiceEditComponent
  extends BaseEditComponent<OutgoingInvoice>
  implements OnInit, OnDestroy {
  private currency = inject(CurrencyPipe);
  private location = inject(Location);
  private authService = inject(AuthStateService);
  private snackBar = inject(MatSnackBar);
  private file = inject(FileService);
  private readonly currencyCode = inject(DEFAULT_CURRENCY_CODE);
  private readonly locale = inject(LOCALE_ID);

  invoiceGroup: UntypedFormGroup;
  submitted = false;
  vatOptions$: Observable<Vat[]>;
  jobId: number;
  navigationTarget = "job";
  hiddenDescriptives: number[];
  buttons: CustomButton[] = [];
  title = "Ausgangsrechnung: Bearbeiten";
  countryOptions$: Observable<Country[]>;
  receivableGroup: FormGroup<{
    entries: FormArray<FormGroup<ReceivableGroup>>
  }> = new FormGroup({
    entries: new FormArray([])
  });
  currentVatMultiplier = 0;
  /** Any receivable paid -> invoice and receivables are read-only. */
  hasPaidReceivables = false;
  company = false;
  readonly paymentTerms = PAYMENT_TERMS;

  calcTotalPrice(formGroup: UntypedFormGroup): void {
    const totalPrice =
      formGroup.get("single_price").value * formGroup.get("amount").value;
    formGroup
      .get("total_price")
      .setValue(
        this.currency.transform(totalPrice, this.currencyCode, "symbol", undefined, this.locale)
      );
    this.recalculateInvoicePrice();
  }

  lockFunction = (id: number): Observable<Lock> =>
    this.api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(id);

  dataFunction = (id: number): Observable<OutgoingInvoice> =>
    this.api.readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(id);

  unlockFunction = (id: number): Observable<boolean> =>
    this.api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(id);

  ngOnInit(): void {
    this.countryOptions$ = this.api.readCountriesAddressCountriesGet();
    // shared so the vat_id listener does not trigger a new request on every change
    this.vatOptions$ = this.api.readVatsVatGet().pipe(shareReplay(1));
    this.hiddenDescriptives = [];
    super.ngOnInit();
    this.initOutgoingInvoiceGroup();
    if (this.createMode) {
      // payment_date is only derived from the terms on user interaction, so apply the default once
      this.applyPaymentTerms(this.invoiceGroup.get("paymentTerms").value, false);
      this.routeParams.subscribe((params) => {
        this.jobId = parseInt(params.job_id, 10);
        if (isNaN(this.jobId)) {
          console.error("OutgoingInvoiceEdit: Cannot determine job id");
          this.router.navigateByUrl(this.navigationTarget);
        }
        this.navigationTarget = "job/" + this.jobId.toString();
        this.api
          .readJobJobJobIdGet(this.jobId)
          .pipe(first())
          .subscribe((job) => {
            this.fillRightSidebar(job.client);
          });
        this.addOtherInvoices();
      });
    }
    this.authService
      .currentUserHasScope(ScopeEnum.Office)
      .pipe(first())
      .subscribe((allowed) => {
        if (allowed) {
          this.buttons.push({
            name: "Rechnung löschen",
            navigate: (): void => {
              const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: "400px",
                data: {
                  title: "Rechnung löschen?",
                  text: "Dieser Schritt kann nicht rückgängig gemacht werden."
                }
              });
              dialogRef.afterClosed().subscribe((result) => {
                if (result) {
                  if (this.createMode) {
                    this.router.navigateByUrl(this.navigationTarget).then(r => console.log(r));
                  } else {
                    this.api
                      .deleteOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdDelete(
                        this.id
                      )
                      .pipe(first())
                      .subscribe(
                        (success) => {
                          if (success) {
                            this.location.back();
                            //this.router.navigateByUrl(this.navigationTarget);
                          } else {
                            this.invoiceDeleteFailed();
                          }
                        },
                        (error) => {
                          this.invoiceDeleteFailed(error);
                        }
                      );
                  }
                }
              });
            }
          });
        }
      });
    if (this.createMode) {
      this.title = "Ausgangsrechnung: Erstellen";
    }
    this.subscription.add(
      this.receivableGroup.valueChanges.subscribe(() => this.recalculateOpenAmount())
    );
  }

  companyCheckBoxClicked(): void {
    if (this.hasPaidReceivables) return;
    this.company = !this.company;
  }

  invoiceDeleteFailed(error?: any) {
    if (error) {
      console.error(error);
    }
    this.snackBar.open(
      "Die Rechnung konnte leider nicht gelöscht werden.",
      "Ok",
      {
        duration: 10000
      }
    );
    this.location.back();
  }

  getDescriptiveArticles(): UntypedFormArray {
    return this.invoiceGroup.get("descriptive_articles") as UntypedFormArray;
  }

  removeDescriptiveArticle(index: number): void {
    if (index === 0 || this.hasPaidReceivables) return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Position löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden."
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDescriptiveArticles().removeAt(index);
        // the total changes, so the receivables have to be rebalanced
        this.recalculateInvoicePrice();
      }
    });
  }

  addDescriptiveArticleAt(index: number): void {
    if (this.hasPaidReceivables) return;
    this.getDescriptiveArticles().insert(
      index + 1,
      this.initDescriptiveArticles()
    );
  }

  moveDescriptiveArticleUp(index: number): void {
    if (index === 0 || this.hasPaidReceivables) return;

    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index - 1, descriptiveArticle);
  }

  moveDescriptiveArticleDown(index: number): void {
    if (index === this.getDescriptiveArticles().controls.length - 1 || this.hasPaidReceivables) return;

    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index + 1, descriptiveArticle);
  }

  transformAmount(i: number) {
    const descriptiveArticle = this.getDescriptiveArticles().at(i);

    const singleP = descriptiveArticle
      .get("singlePriceFormatted").value ?? "";

    const singlePrice = parseFloat(
      singleP
        .replace("€", "")
        .replace(".", "")
        .replace(",", ".")
    );
    const formattedAmount = this.currency.transform(
      singlePrice,
      this.currencyCode,
      "symbol",
      undefined,
      this.locale
    );
    descriptiveArticle.get("single_price").setValue(singlePrice);
    descriptiveArticle.get("singlePriceFormatted").setValue(formattedAmount);
  }

  onSubmit(): void {
    this.submitted = true;
    const descriptiveArticles = [];
    this.getDescriptiveArticles().controls.forEach(
      (descriptiveArticleControl) => {
        const descriptiveArticle: DescriptiveArticleCreate = {
          name: "",
          amount: descriptiveArticleControl.get("amount").value,
          description: descriptiveArticleControl.get("description").value,
          single_price: descriptiveArticleControl.get("single_price").value,
          discount: 0,
          alternative: false,
          descriptive_articles: [],
          vat_id: this.invoiceGroup.get("vat_id").value
        };
        descriptiveArticles.push(descriptiveArticle);
      }
    );

    const fullName = this.invoiceGroup.get("name").value.toString();

    if (this.createMode) {

      let number = this.invoiceGroup.get("number").value;
      if (typeof number === "number") {
        number = number.toString(10);
      }
      const invoiceCreate: OutgoingInvoiceCreate = {
        number,
        date: formatDateTransport(this.invoiceGroup.get("date").value),
        payment_condition: this.invoiceGroup.get("payment_condition").value,
        payment_date: formatDateTransport(
          this.invoiceGroup.get("payment_date").value
        ),
        paymentTerms: this.invoiceGroup.get("paymentTerms").value,
        vat_id: this.invoiceGroup.get("vat_id").value,
        job_id: this.jobId,
        descriptive_articles: descriptiveArticles,
        name: this.invoiceGroup.get("name").value,
        vat_number: this.invoiceGroup.get("vat_number").value,
        fiscal_code: this.invoiceGroup.get("fiscal_code").value,
        codice_destinatario: this.invoiceGroup.get("codice_destinatario").value,
        pec: this.invoiceGroup.get("pec").value,
        isCompany: this.company,
        address: {
          name: fullName,
          street_number: this.invoiceGroup.get("address.street_number").value,
          city: this.invoiceGroup.get("address.city").value,
          cap: this.invoiceGroup.get("address.cap").value,
          country_code: this.invoiceGroup.get("address.country").value
        }
      };
      this.api
        .createOutgoingInvoiceOutgoingInvoicePost(invoiceCreate)
        .pipe(first())
        .subscribe(
          (invoice) => {
            this.createUpdateSuccess(invoice);
          },
          (error) => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          }
        );
    } else {
      const receivables: ReceivableInstallment[] = this.receivableGroup.controls.entries.controls.map((grp) => {
        return {
          amount: this.receivableAmount(grp),
          due_date: formatDateTransport(grp.get("dueDate").value.toISOString())
        };
      });
      let number = this.invoiceGroup.get("number").value;
      if (typeof number === "number") {
        number = number.toString(10);
      }
      const invoiceUpdate: OutgoingInvoiceUpdate = {
        number,
        receivables,
        date: formatDateTransport(this.invoiceGroup.get("date").value),
        payment_condition: this.invoiceGroup.get("payment_condition").value,
        payment_date: formatDateTransport(
          this.invoiceGroup.get("payment_date").value
        ),
        paymentTerms: this.invoiceGroup.get("paymentTerms").value,
        vat_id: this.invoiceGroup.get("vat_id").value,
        descriptive_articles: descriptiveArticles,
        name: this.invoiceGroup.get("name").value,
        vat_number: this.invoiceGroup.get("vat_number").value,
        fiscal_code: this.invoiceGroup.get("fiscal_code").value,
        codice_destinatario: this.invoiceGroup.get("codice_destinatario").value,
        pec: this.invoiceGroup.get("pec").value,
        isCompany: this.company,
        address: {
          name: fullName,
          street_number: this.invoiceGroup.get("address.street_number").value,
          city: this.invoiceGroup.get("address.city").value,
          cap: this.invoiceGroup.get("address.cap").value,
          country_code: this.invoiceGroup.get("address.country").value
        }
      };
      this.api
        .updateOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdPut(
          this.id,
          invoiceUpdate
        )
        .pipe(first())
        .subscribe(
          (invoice) => {
            this.createUpdateSuccess(invoice);
          },
          (error) => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          }
        );
    }
  }

  createUpdateSuccess(invoice: OutgoingInvoice): void {
    this.id = invoice.id;
    this.file.open(invoice.pdf);
    this.location.back();
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$
        .pipe(tap((invoice) => this.invoiceGroup.patchValue(invoice)))
        .subscribe((invoice) => {
          this.currentVatMultiplier = invoice.vat.multiplier;
          this.getDescriptiveArticles().removeAt(0);
          invoice.descriptive_articles.forEach((descriptiveArticle) => {
            this.getDescriptiveArticles().push(
              this.initDescriptiveArticles(descriptiveArticle)
            );
          });
          this.company = invoice.isCompany;
          this.invoiceGroup.patchValue({
            vat_id: invoice.vat.id,
            address: {
              country: invoice.address.country.code
            }
          });
          this.jobId = invoice.job_id;
          this.recalculateInvoicePrice();
          this.reloadReceivables(invoice);
        });
    }
  }

  protected initDescriptiveArticles(
    descriptiveArticle?: DescriptiveArticle
  ): UntypedFormGroup {
    const descriptiveArticleFormGroup = new UntypedFormGroup({
      description: new UntypedFormControl(""),
      amount: new UntypedFormControl("0"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price: new UntypedFormControl("0"),
      singlePriceFormatted: new UntypedFormControl("0,00 €"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      total_price: new UntypedFormControl("0")
    });

    this.subscription.add(
      descriptiveArticleFormGroup
        .get("single_price")
        .valueChanges.subscribe(() => {
        this.calcTotalPrice(descriptiveArticleFormGroup);
      })
    );
    this.subscription.add(
      descriptiveArticleFormGroup.get("amount").valueChanges.subscribe(() => {
        this.calcTotalPrice(descriptiveArticleFormGroup);
      })
    );

    if (descriptiveArticle !== undefined) {
      descriptiveArticleFormGroup.patchValue({
        description: descriptiveArticle.description,
        amount: descriptiveArticle.amount,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: descriptiveArticle.single_price,
        singlePriceFormatted: this.currency.transform(
          descriptiveArticle.single_price,
          this.currencyCode, "symbol", undefined, this.locale
        )
      });
    }

    return descriptiveArticleFormGroup;
  }

  private resolvePaymentTerms(value: PaymentTermEnum): PaymentTermsResolved {
    switch (value) {
      case PaymentTermEnum.Gg30:
        return { label: "30 Tage", daysToAdd: 30 };
      case PaymentTermEnum.Gg14:
        return { label: "14 Tage", daysToAdd: 14 };
      case PaymentTermEnum.OnSight:
        return { label: "Bei Sicht", daysToAdd: 0 };
      default:
        return { label: "", daysToAdd: 0 };
    }
  }

  protected onPaymentTermsChanged(value: MatSelectChange<PaymentTermEnum>): void {
    this.applyPaymentTerms(value.value, true);
  }

  /** User changed the invoice date: keep the due date in sync with the selected payment terms. */
  protected onInvoiceDateChanged(): void {
    this.applyPaymentTerms(this.invoiceGroup.get("paymentTerms").value, false);
  }

  /**
   * Derives payment_date from the invoice date and the given terms.
   * Only called on user interaction / create-init, never when loading an invoice,
   * so a stored payment_date is not overwritten.
   */
  private applyPaymentTerms(term: PaymentTermEnum, setCondition: boolean): void {
    const resolved = this.resolvePaymentTerms(term);

    // Use invoice date as base; fallback to "now" if missing/invalid
    const invoiceDateRaw = this.invoiceGroup.get("date")?.value;
    const baseDate = invoiceDateRaw ? new Date(invoiceDateRaw) : new Date();
    if (Number.isNaN(baseDate.getTime())) {
      // If "date" is not parsable, just use today
      baseDate.setTime(Date.now());
    }

    const newPaymentDate = new Date(baseDate);
    newPaymentDate.setDate(newPaymentDate.getDate() + resolved.daysToAdd);

    // Update the fields (emitEvent:false prevents loops if you later subscribe to these too)
    if (setCondition) {
      this.invoiceGroup.get("payment_condition")?.setValue(resolved.label, { emitEvent: false });
    }
    // emits on purpose: the payment_date listener moves the due date of the open remainder
    this.invoiceGroup.get("payment_date")?.setValue(newPaymentDate);
  }

  private addDescriptiveArticle(
    name: string,
    amount: string,
    singlePrice: string,
    totalPrice: string
  ): void {
    const descriptiveArticleFormGroup = new UntypedFormGroup({
      description: new UntypedFormControl(name),
      amount: new UntypedFormControl(amount),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price: new UntypedFormControl(singlePrice),
      singlePriceFormatted: new UntypedFormControl(
        this.currency.transform(singlePrice, this.currencyCode, "symbol", undefined, this.locale)
      ),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      total_price: new UntypedFormControl(totalPrice)
    });
    this.getDescriptiveArticles().push(descriptiveArticleFormGroup);
  }

  private initOutgoingInvoiceGroup() {
    const now = new Date();
    const now30gg = new Date();
    now30gg.setDate(now.getDate() + 30);

    this.invoiceGroup = new UntypedFormGroup({
      date: new UntypedFormControl(now.toISOString()),
      // eslint-disable-next-line id-blacklist
      number: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: new UntypedFormControl(-1),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_condition: new UntypedFormControl(""),
      paymentTerms: new UntypedFormControl(PaymentTermEnum.Gg30),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_date: new UntypedFormControl(now30gg),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      descriptive_articles: new UntypedFormArray([
        this.initDescriptiveArticles()
      ]),
      invoice_price: new UntypedFormControl(),
      open_amount: new UntypedFormControl(),
      open_amount_formatted: new UntypedFormControl(),
      address: new UntypedFormGroup({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: new UntypedFormControl(""),
        city: new UntypedFormControl(""),
        cap: new UntypedFormControl(""),
        country: new UntypedFormControl("IT")
      }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_number: new UntypedFormControl("IT"),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fiscal_code: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      codice_destinatario: new UntypedFormControl("0000000"),
      pec: new UntypedFormControl(""),
      name: new UntypedFormControl("")
    });
    this.subscription.add(
      this.invoiceGroup.get("vat_id").valueChanges.pipe(
        distinctUntilChanged(),
        switchMap((vatId: number) => this.vatOptions$.pipe(
          first(),
          map((vatOptions) => vatOptions.find((vat) => vat.id === vatId))
        ))
      ).subscribe((vat) => {
        // unknown id (e.g. the -1 placeholder): keep the current multiplier, saving is blocked anyway
        if (!vat) {
          return;
        }
        this.currentVatMultiplier = vat.multiplier;
        this.recalculateInvoicePrice();
      })
    );
    this.api
      .getNextRgNumberOutgoingInvoiceRgNumberGet()
      .pipe(first())
      .subscribe((nextRgNumber) => {
        this.invoiceGroup.get("number").setValue(nextRgNumber);
      });
    this.subscription.add(
      this.invoiceGroup.get("payment_date").valueChanges.subscribe((paymentDate: unknown) => {
        // null when the field is cleared, string when patched from the loaded invoice
        if (!(paymentDate instanceof Date) || Number.isNaN(paymentDate.getTime())) {
          return;
        }
        // only the open remainder follows the payment date; paid receivables are never touched
        this.balancingReceivable()?.controls.dueDate.setValue(paymentDate);
      })
    );
  }

  private recalculateInvoicePrice() {
    let invoicePrice = 0.0;
    this.getDescriptiveArticles().controls.forEach(
      (descriptiveArticleControl) => {
        invoicePrice +=
          parseFloat(descriptiveArticleControl.get("single_price").value) *
          parseFloat(descriptiveArticleControl.get("amount").value);
      }
    );
    this.invoiceGroup
      .patchValue({ invoice_price: roundCents(invoicePrice + (invoicePrice * this.currentVatMultiplier)) });
    this.recalculateOpenAmount();
  }

  /** Invoice total incl. VAT (sum of articles + VAT), rounded to cents. May be negative. */
  private invoiceTotal(): number {
    return roundCents(Number(this.invoiceGroup.get("invoice_price").value) || 0);
  }

  /**
   * Keeps the receivables summing up to the invoice total by putting the difference
   * on the open remainder (the last receivable).
   * Once any receivable is paid, invoice and receivables are read-only and nothing is
   * recalculated anymore; the displayed remainder is then just the unpaid sum.
   */
  private recalculateOpenAmount() {
    const entries = this.receivableGroup.controls.entries.controls;
    let openAmount: number;
    if (this.hasPaidReceivables) {
      openAmount = roundCents(
        entries
          .filter((group) => !group.controls.paid.value)
          .reduce((sum, group) => sum + this.receivableAmount(group), 0)
      );
    } else {
      const balancing = this.balancingReceivable();
      const othersSum = roundCents(
        entries
          .filter((group) => group !== balancing)
          .reduce((sum, group) => sum + this.receivableAmount(group), 0)
      );
      openAmount = roundCents(this.invoiceTotal() - othersSum);
      balancing?.controls.amount.setValue(openAmount, { emitEvent: false });
    }
    this.invoiceGroup.patchValue({
      open_amount: openAmount,
      open_amount_formatted: this.currency.transform(openAmount, this.currencyCode, "symbol", undefined, this.locale)
    }, { emitEvent: false });
  }

  private fillRightSidebar(client: Client): void {
    const langCodeLower = client.language.code.toLowerCase();
    this.getAndFillParameters(
      "payment_condition",
      "invoice_payment_condition_" + langCodeLower
    );
    this.company = client.isCompany;
    this.invoiceGroup
      .get("name")
      .setValue(client.fullname ? client.fullname : client.name);
    this.invoiceGroup.get("address").patchValue({
      name: client.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      street_number: client.address.street_number,
      city: client.address.city,
      cap: client.address.cap,
      country: client.address.country.code
    });
    this.invoiceGroup.get("vat_number").setValue(client.vat_number);
    this.invoiceGroup.get("fiscal_code").setValue(client.fiscal_code);
    this.invoiceGroup.get("pec").setValue(client.pec);
    this.invoiceGroup
      .get("codice_destinatario")
      .setValue(client.codice_destinatario);
  }

  private getAndFillParameters(formControlName: string, key: string) {
    this.api
      .getParameterParameterKeyGet(key)
      .pipe(first())
      .subscribe((parameter) => {
        this.invoiceGroup.patchValue({
          [formControlName]: parameter
        });
      });
  }

  private addOtherInvoices() {
    this.api
      .readOutgoingInvoicesByJobOutgoingInvoiceJobJobIdGet(this.jobId)
      .pipe(first())
      .subscribe((outgoingInvoices) => {
        for (const outgoingInvoice of outgoingInvoices) {
          this.addDescriptiveArticle(
            "Abzüglich Rechnung Nr. " +
            outgoingInvoice.number +
            " vom " +
            dayjs(outgoingInvoice.date, "YYYY-MM-DD").format("DD.MM.YYYY"),
            "1",
            (outgoingInvoice.full_price_without_vat * -1).toString(),
            (outgoingInvoice.full_price_without_vat * -1).toString()
          );
        }
        // these rows have no change listeners, so update the total explicitly
        this.recalculateInvoicePrice();
        //this.addDescriptiveArticleAt(this.getDescriptiveArticles().length - 1);
      });
  }

  /** Amount of a receivable as a number rounded to cents (empty input counts as 0). */
  protected receivableAmount(group: FormGroup<ReceivableGroup>): number {
    return roundCents(Number(group.controls.amount.value) || 0);
  }

  /**
   * The open remainder ("Restbetrag"): the last receivable. It absorbs every difference
   * so the receivables always sum up to the invoice total.
   * undefined when there are no receivables or the invoice is read-only (something is paid).
   */
  protected balancingReceivable(): FormGroup<ReceivableGroup> | undefined {
    if (this.hasPaidReceivables) {
      return undefined;
    }
    const controls = this.receivableGroup.controls.entries.controls;
    return controls[controls.length - 1];
  }

  protected isBalancing(group: FormGroup<ReceivableGroup>): boolean {
    return group === this.balancingReceivable();
  }

  /** Receivables can only be added/removed/changed while nothing is paid. */
  protected canEditReceivables(): boolean {
    return this.balancingReceivable() !== undefined;
  }

  /**
   * Every receivable must have the same sign as the invoice total.
   * 0 is always allowed; a total of 0 therefore only allows 0.
   */
  protected hasWrongSign(group: FormGroup<ReceivableGroup>): boolean {
    const amount = this.receivableAmount(group);
    return amount !== 0 && Math.sign(amount) !== Math.sign(this.invoiceTotal());
  }

  /** The installments exceed the total, so the calculated remainder flipped its sign. */
  protected remainderHasWrongSign(): boolean {
    const balancing = this.balancingReceivable();
    return !!balancing && this.hasWrongSign(balancing);
  }

  protected controlInvalid(group: FormGroup<ReceivableGroup>) {
    if (!group)
      return false;
    if (this.hasPaidReceivables || group.get("paid").value) {
      return false;
    }
    if (this.isBalancing(group)) {
      // amount is calculated (disabled control) -> its sign is reported via remainderHasWrongSign()
      const date = group.get("dueDate").value;
      if (!date) {
        group.get("dueDate").setErrors({ invalid: true });
        group.get("dueDate").markAsTouched();
      } else {
        group.get("dueDate").setErrors(null);
        group.get("dueDate").markAsTouched();
      }
      return !date || this.hasWrongSign(group);
    }
    const date = group.get("dueDate").value;
    const m = this.maxDate();
    const dateValid = !!date && !!m && (date.getTime() < m.getTime());
    if (!dateValid) {
      group.get("dueDate").setErrors({ invalid: true });
      group.get("dueDate").markAsTouched();
    } else {
      group.get("dueDate").setErrors(null);
      group.get("dueDate").markAsTouched();
    }
    const signValid = !this.hasWrongSign(group);
    if (!signValid) {
      group.get("amount").setErrors({ sign: true });
      group.get("amount").markAsTouched();
    } else {
      group.get("amount").setErrors(null);
    }
    return !dateValid || !signValid;
  }

  protected groupInvalid(group: FormGroup<ReceivableGroup>) {
    if (!group)
      return false;
    return this.controlInvalid(group);
  }

  protected formInvalid() {
    let inValid = false;
    if (this.receivableGroup.controls.entries.length !== 0) {
      inValid = inValid || !!this.receivableGroup.controls.entries.controls.find(grp => this.groupInvalid(grp));
    }
    const vat_id = this.invoiceGroup.get("vat_id").value;
    inValid = inValid || vat_id === -1;
    // once something is paid the invoice is read-only, there is nothing to save
    inValid = inValid || this.hasPaidReceivables;
    return inValid;
  }

  reloadReceivables(invoice: OutgoingInvoice) {
    this.receivableGroup.controls.entries.clear({ emitEvent: false });
    const sorted = [...invoice.receivables].sort((a, b) => {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
    this.hasPaidReceivables = sorted.some((item) => item.paid);
    // the remainder is the last receivable, its amount is always calculated
    const balancingIndex = sorted.length - 1;
    sorted.forEach((item, index) => {
      const grp = new FormGroup<ReceivableGroup>({
        id: new FormControl(item.id),
        dueDate: new FormControl(new Date(item.due_date)),
        dueDateOrig: new FormControl(new Date(item.due_date)),
        amount: new FormControl(item.amount),
        amountOrig: new FormControl(item.amount),
        paid: new FormControl(item.paid)
      });
      if (item.paid) {
        grp.controls.amount.disable();
        grp.controls.dueDate.disable();
      } else if (index === balancingIndex) {
        grp.controls.amount.disable();
      }
      this.receivableGroup.controls.entries.push(grp, { emitEvent: false });
    });
    if (this.hasPaidReceivables) {
      // a payment was registered: neither the invoice nor its receivables may change anymore
      this.receivableGroup.disable({ emitEvent: false });
      this.invoiceGroup.disable({ emitEvent: false });
    }
    this.recalculateOpenAmount();
  }

  protected readonly dayjs = dayjs;
  protected readonly formatCurrency = formatCurrency;

  protected onAddLine() {
    if (this.canEditReceivables()) {
      this.receivableGroup.controls.entries.insert(0, new FormGroup({
        id: new FormControl(-1),
        amount: new FormControl(0),
        amountOrig: new FormControl(0),
        dueDate: new FormControl(new Date()),
        dueDateOrig: new FormControl(new Date(0)),
        paid: new FormControl(false)
      }), { emitEvent: false });
    }
  }

  protected hasChangesControl(group: FormGroup<ReceivableGroup>, key: "amount" | "dueDate") {
    if (key === "amount") {
      return group.get("amount").value !== group.get(`amountOrig`).value;
    } else {
      const date = group.get("dueDate").value;
      const dateOrig = group.get("dueDateOrig").value;
      if (!date || !dateOrig) {
        return false;
      }
      return date.getTime() !== dateOrig.getTime();
    }
  }

  protected onDelete(index: number) {
    const grp = this.receivableGroup.controls.entries.at(index);
    // nothing can be removed once something is paid; the remainder itself is never removed
    if (grp && this.canEditReceivables() && !this.isBalancing(grp)) {
      // emits -> recalculateOpenAmount moves the amount back onto the remainder
      this.receivableGroup.controls.entries.removeAt(index);
    }
  }

  /** Unpaid installments have to be due before the remainder. */
  private maxDate() {
    return this.balancingReceivable()?.controls.dueDate.value ?? undefined;
  }

}

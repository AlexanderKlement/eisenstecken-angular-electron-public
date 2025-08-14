import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  Client,
  DefaultService,
  DescriptiveArticle,
  DescriptiveArticleCreate,
  Lock,
  OutgoingInvoice,
  OutgoingInvoiceCreate,
  OutgoingInvoiceUpdate,
  Vat
} from 'eisenstecken-openapi-angular-library';
import {BaseEditComponent} from '../../shared/components/base-edit/base-edit.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {UntypedFormArray, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {first, tap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import {CustomButton} from '../../shared/components/toolbar/toolbar.component';
import {AuthService} from '../../shared/services/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as moment from 'moment';
import {formatDateTransport} from '../../shared/date.util';
import {FileService} from '../../shared/services/file.service';
import {CurrencyPipe, getLocaleCurrencyCode} from '@angular/common';
import {NavigationService} from '../../shared/services/navigation.service';

@Component({
  selector: 'app-outgoing-invoice-edit',
  templateUrl: './outgoing-invoice-edit.component.html',
  styleUrls: ['./outgoing-invoice-edit.component.scss']
})
export class OutgoingInvoiceEditComponent extends BaseEditComponent<OutgoingInvoice> implements OnInit, OnDestroy {

  invoiceGroup: UntypedFormGroup;
  submitted = false;
  vatOptions$: Observable<Vat[]>;
  jobId: number;
  navigationTarget = 'job';
  hiddenDescriptives: number[];
  buttons: CustomButton[] = [];
  title = 'Ausgangsrechnung: Bearbeiten';

  company = false;

  constructor(api: DefaultService, router: Router, route: ActivatedRoute, dialog: MatDialog, private currency: CurrencyPipe,
              private authService: AuthService, private snackBar: MatSnackBar, private file: FileService,
              private navigation: NavigationService) {
    super(api, router, route, dialog);
  }

  calcTotalPrice(formGroup: UntypedFormGroup): void {
    const totalPrice = formGroup.get('single_price').value * formGroup.get('amount').value;
    formGroup.get('total_price').setValue(this.currency.transform(totalPrice, getLocaleCurrencyCode('de_DE')));
    this.recalculateInvoicePrice();
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedOutgoingInvoiceOutgoingInvoiceIslockedOutgoingInvoiceIdGet(id);

  dataFunction = (api: DefaultService, id: number): Observable<OutgoingInvoice> =>
    api.readOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdGet(id);

  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.unlockOutgoingInvoiceOutgoingInvoiceUnlockOutgoingInvoiceIdPost(id);

  ngOnInit(): void {
    this.hiddenDescriptives = [];
    super.ngOnInit();
    this.vatOptions$ = this.api.readVatsVatGet();
    this.initOutgoingInvoiceGroup();
    if (this.createMode) {
      this.routeParams.subscribe((params) => {
        this.jobId = parseInt(params.job_id, 10);
        if (isNaN(this.jobId)) {
          console.error('OutgoingInvoiceEdit: Cannot determine job id');
          this.router.navigateByUrl(this.navigationTarget);
        }
        this.navigationTarget = 'job/' + this.jobId.toString();
        this.api.readJobJobJobIdGet(this.jobId).pipe(first()).subscribe((job) => {
          this.fillRightSidebar(job.client);
        });
        this.addOtherInvoices();
      });
    }
    this.authService.currentUserHasRight('outgoing_invoices:delete').pipe(first()).subscribe(allowed => {
      if (allowed) {
        this.buttons.push({
          name: 'Rechnung löschen',
          navigate: (): void => {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
              width: '400px',
              data: {
                title: 'Rechnung löschen?',
                text: 'Dieser Schritt kann nicht rückgängig gemacht werden.'
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                if (this.createMode) {
                  this.router.navigateByUrl(this.navigationTarget);
                } else {
                  this.api.deleteOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdDelete(this.id)
                    .pipe(first()).subscribe((success) => {
                      if (success) {
                        this.navigation.back();
                        //this.router.navigateByUrl(this.navigationTarget);
                      } else {
                        this.invoiceDeleteFailed();
                      }
                    },
                    error => {
                      this.invoiceDeleteFailed(error);
                    });
                }
              }
            });
          }
        });
      }
    });
    if (this.createMode) {
      this.title = 'Ausgangsrechnung: Erstellen';
    }
  }

  getAddressGroup(): UntypedFormGroup {
    return this.invoiceGroup.get('address') as UntypedFormGroup;
  }

  companyCheckBoxClicked(): void {
    this.company = !this.company;
  }

  invoiceDeleteFailed(error?: any) {
    if (error) {
      console.error(error);
    }
    this.snackBar.open('Die Rechnung konnte leider nicht gelöscht werden.'
      , 'Ok', {
        duration: 10000
      });
    this.navigation.back();
  }

  getDescriptiveArticles(): UntypedFormArray {
    return this.invoiceGroup.get('descriptive_articles') as UntypedFormArray;
  }


  removeDescriptiveArticle(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Position löschen?',
        text: 'Dieser Schritt kann nicht rückgängig gemacht werden.'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDescriptiveArticles().removeAt(index);
      }
    });

  }

  addDescriptiveArticleAt(index: number): void {
    this.getDescriptiveArticles().insert(index + 1, this.initDescriptiveArticles());
  }


  toggleCollapseDescriptiveArticle(index: number | undefined): void {
    if (index === -1) {
      const control = this.getDescriptiveArticles().controls;
      if (control.length === this.hiddenDescriptives.length) {
        this.hiddenDescriptives = [];
        return;
      }

      this.hiddenDescriptives = [];
      control.forEach((_, idx) => {
        this.hiddenDescriptives.push(idx);
      });
      return;
    }
    const oldLength = this.hiddenDescriptives.length;
    this.hiddenDescriptives = this.hiddenDescriptives.filter((idx) => idx !== index);
    if (oldLength === this.hiddenDescriptives.length) {
      this.hiddenDescriptives.push(index);
    }
  }

  isHidden(index: number | undefined): boolean {
    if (index === -1) {
      return this.getDescriptiveArticles().controls.length === this.hiddenDescriptives.length;
    }
    return this.hiddenDescriptives.filter(idx => idx === index).length !== 0;
  }

  moveDescriptiveArticleUp(index: number): void {
    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index - 1, descriptiveArticle);
  }

  moveDescriptiveArticleDown(index: number): void {
    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index + 1, descriptiveArticle);
  }

  transformAmount(i: number) {
    const descriptiveArticle = this.getDescriptiveArticles().at(i);
    const singlePrice = parseFloat(descriptiveArticle.get('singlePriceFormatted').value.replace('€', '').replace('.', '').replace(',', '.'));
    const formattedAmount = this.currency.transform(singlePrice, getLocaleCurrencyCode('de_DE'));
    descriptiveArticle.get('single_price').setValue(singlePrice);
    descriptiveArticle.get('singlePriceFormatted').setValue(formattedAmount);
  }

  onSubmit(): void {
    this.submitted = true;
    const descriptiveArticles = [];
    this.getDescriptiveArticles().controls.forEach((descriptiveArticleControl) => {
      const descriptiveArticle: DescriptiveArticleCreate = {
        name: '',
        amount: descriptiveArticleControl.get('amount').value,
        description: descriptiveArticleControl.get('description').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: descriptiveArticleControl.get('single_price').value,
        discount: 0,
        alternative: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        descriptive_articles: [],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: this.invoiceGroup.get('vat_id').value,
      };
      descriptiveArticles.push(descriptiveArticle);
    });

    const fullName = this.invoiceGroup.get('name').value.toString();

    if (this.createMode) {
      const invoiceCreate: OutgoingInvoiceCreate = {
        // eslint-disable-next-line id-blacklist
        number: this.invoiceGroup.get('number').value,
        date: formatDateTransport(this.invoiceGroup.get('date').value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payment_condition: this.invoiceGroup.get('payment_condition').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payment_date: formatDateTransport(this.invoiceGroup.get('payment_date').value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: this.invoiceGroup.get('vat_id').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: this.jobId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        descriptive_articles: descriptiveArticles,
        name: this.invoiceGroup.get('name').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_number: this.invoiceGroup.get('vat_number').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fiscal_code: this.invoiceGroup.get('fiscal_code').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        codice_destinatario: this.invoiceGroup.get('codice_destinatario').value,
        pec: this.invoiceGroup.get('pec').value,
        isCompany: this.company,
        address: {
          name: fullName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          street_number: this.invoiceGroup.get('address.street_number').value,
          city: this.invoiceGroup.get('address.city').value,
          cap: this.invoiceGroup.get('address.cap').value,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          country_code: this.invoiceGroup.get('address.country').value,
        },
      };
      this.api.createOutgoingInvoiceOutgoingInvoicePost(invoiceCreate).pipe(first()).subscribe((invoice) => {
        this.createUpdateSuccess(invoice);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    } else {
      const invoiceUpdate: OutgoingInvoiceUpdate = {
        // eslint-disable-next-line id-blacklist
        number: this.invoiceGroup.get('number').value,
        date: formatDateTransport(this.invoiceGroup.get('date').value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payment_condition: this.invoiceGroup.get('payment_condition').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        payment_date: formatDateTransport(this.invoiceGroup.get('payment_date').value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: this.invoiceGroup.get('vat_id').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        descriptive_articles: descriptiveArticles,
        name: this.invoiceGroup.get('name').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_number: this.invoiceGroup.get('vat_number').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        fiscal_code: this.invoiceGroup.get('fiscal_code').value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        codice_destinatario: this.invoiceGroup.get('codice_destinatario').value,
        pec: this.invoiceGroup.get('pec').value,
        isCompany: this.company,
        address: {
          name: fullName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          street_number: this.invoiceGroup.get('address.street_number').value,
          city: this.invoiceGroup.get('address.city').value,
          cap: this.invoiceGroup.get('address.cap').value,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          country_code: this.invoiceGroup.get('address.country').value,
        },
      };
      this.api.updateOutgoingInvoiceOutgoingInvoiceOutgoingInvoiceIdPut(this.id, invoiceUpdate).pipe(first()).subscribe((invoice) => {
        this.createUpdateSuccess(invoice);
      }, (error) => {
        this.createUpdateError(error);
      }, () => {
        this.createUpdateComplete();
      });
    }
  }

  createUpdateSuccess(invoice: OutgoingInvoice): void {
    this.id = invoice.id;
    this.file.open(invoice.pdf);
    this.navigation.back();
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$.pipe(tap(invoice => this.invoiceGroup.patchValue(invoice))).subscribe((invoice) => {
        this.getDescriptiveArticles().removeAt(0);
        invoice.descriptive_articles.forEach((descriptiveArticle) => {
          this.getDescriptiveArticles().push(this.initDescriptiveArticles(descriptiveArticle));
        });
        this.company = invoice.isCompany;
        this.invoiceGroup.patchValue({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          vat_id: invoice.vat.id,

          address: {
            country: invoice.address.country.code
          }
        });
        this.jobId = invoice.job_id;
        this.recalculateInvoicePrice();
      });

    }

  }

  protected initDescriptiveArticles(descriptiveArticle?: DescriptiveArticle): UntypedFormGroup {
    const descriptiveArticleFormGroup = new UntypedFormGroup({
      description: new UntypedFormControl(''),
      amount: new UntypedFormControl('0'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price: new UntypedFormControl('0'),
      singlePriceFormatted: new UntypedFormControl('0,00 €'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      total_price: new UntypedFormControl('0')
    });

    this.subscription.add(descriptiveArticleFormGroup.get('single_price').valueChanges.subscribe(
      () => {
        this.calcTotalPrice(descriptiveArticleFormGroup);
      }));
    this.subscription.add(descriptiveArticleFormGroup.get('amount').valueChanges.subscribe(
      () => {
        this.calcTotalPrice(descriptiveArticleFormGroup);
      }));

    if (descriptiveArticle !== undefined) {
      descriptiveArticleFormGroup.patchValue({
        description: descriptiveArticle.description,
        amount: descriptiveArticle.amount,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: descriptiveArticle.single_price,
        singlePriceFormatted: this.currency.transform(descriptiveArticle.single_price,
          getLocaleCurrencyCode('de_DE')),
      });
    }

    return descriptiveArticleFormGroup;
  }

  private addDescriptiveArticle(name: string, amount: string, singlePrice: string, totalPrice: string): void {
    const descriptiveArticleFormGroup = new UntypedFormGroup({
      description: new UntypedFormControl(name),
      amount: new UntypedFormControl(amount),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      single_price: new UntypedFormControl(singlePrice),
      singlePriceFormatted: new UntypedFormControl(this.currency.transform(singlePrice,
        getLocaleCurrencyCode('de_DE'))),
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
      number: new UntypedFormControl(''),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: new UntypedFormControl(3),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_condition: new UntypedFormControl(''),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      payment_date: new UntypedFormControl(now30gg),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      descriptive_articles: new UntypedFormArray([
        this.initDescriptiveArticles()
      ]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      invoice_price: new UntypedFormControl(),
      address: new UntypedFormGroup({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        street_number: new UntypedFormControl(''),
        city: new UntypedFormControl(''),
        cap: new UntypedFormControl(''),
        country: new UntypedFormControl('IT')
      }),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_number: new UntypedFormControl('IT'),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fiscal_code: new UntypedFormControl(''),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      codice_destinatario: new UntypedFormControl('0000000'),
      pec: new UntypedFormControl(''),
      name: new UntypedFormControl('')
    });
    this.api.getNextRgNumberOutgoingInvoiceRgNumberGet().pipe(first()).subscribe((nextRgNumber) => {
      this.invoiceGroup.get('number').setValue(nextRgNumber);
    });
  }

  private recalculateInvoicePrice() {
    let invoicePrice = 0.0;
    this.getDescriptiveArticles().controls.forEach((descriptiveArticleControl) => {
      invoicePrice += parseFloat(descriptiveArticleControl.get('single_price').value) *
        parseFloat(descriptiveArticleControl.get('amount').value);
    });
    this.invoiceGroup.get('invoice_price').setValue(this.currency.transform(invoicePrice, getLocaleCurrencyCode('de_DE')));
  }

  private fillRightSidebar(client: Client): void {
    const langCodeLower = client.language.code.toLowerCase();
    this.getAndFillParameters('payment_condition', 'invoice_payment_condition_' + langCodeLower);
    this.company = client.isCompany;
    this.invoiceGroup.get('name').setValue(client.fullname ? client.fullname : client.name);
    this.invoiceGroup.get('address').patchValue({
      name: client.name,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      street_number: client.address.street_number,
      city: client.address.city,
      cap: client.address.cap,
      country: client.address.country.code
    });
    this.invoiceGroup.get('vat_number').setValue(client.vat_number);
    this.invoiceGroup.get('fiscal_code').setValue(client.fiscal_code);
    this.invoiceGroup.get('pec').setValue(client.pec);
    this.invoiceGroup.get('codice_destinatario').setValue(client.codice_destinatario);

  }

  private getAndFillParameters(formControlName: string, key: string) {
    this.api.getParameterParameterKeyGet(key).pipe(first()).subscribe((parameter) => {
      this.invoiceGroup.patchValue({
        [formControlName]: parameter,
      });
    });
  }

  private addOtherInvoices() {
    this.api.readOutgoingInvoicesByJobOutgoingInvoiceJobJobIdGet(this.jobId).pipe(first()).subscribe((outgoingInvoices) => {
      for (const outgoingInvoice of outgoingInvoices) {
        this.addDescriptiveArticle(
          'Abzüglich Rechnung Nr. ' + outgoingInvoice.number + ' vom '
          + moment(outgoingInvoice.date, 'YYYY-MM-DD').format('DD.MM.YYYY'),
          '1',
          (outgoingInvoice.full_price_without_vat * (-1)).toString(),
          (outgoingInvoice.full_price_without_vat * (-1)).toString(),
        );
      }
      //this.addDescriptiveArticleAt(this.getDescriptiveArticles().length - 1);
    });
  }
}

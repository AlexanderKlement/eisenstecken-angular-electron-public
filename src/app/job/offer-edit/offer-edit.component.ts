import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subscription } from "rxjs";
import { first, tap } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { FileService } from "../../shared/services/file.service";
import { formatDateTransport } from "../../shared/date.util";
import {
  CustomButton,
  ToolbarComponent,
} from "../../shared/components/toolbar/toolbar.component";
import {
  CurrencyPipe,
  getLocaleCurrencyCode,
  AsyncPipe,
} from "@angular/common";
import {
  DescriptiveArticleCreate,
  OfferCreate,
  OfferUpdate,
  Offer,
  Vat,
  DefaultService,
  DescriptiveArticle,
  Lock,
} from "../../../api/openapi";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  DefaultFlexDirective,
  FlexModule,
} from "ng-flex-layout";
import {
  MatFormField,
  MatLabel,
  MatInput,
  MatSuffix,
} from "@angular/material/input";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatSelect, MatOption } from "@angular/material/select";
import {
  MatDatepickerInput,
  MatDatepickerToggle,
  MatDatepicker,
} from "@angular/material/datepicker";
import { CircleIconButtonComponent } from "../../shared/components/circle-icon-button/circle-icon-button.component";
import { DirtyAware } from "../../shared/guards/dirty-form.guard";

@Component({
  selector: 'app-offer-edit',
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss'],
  imports: [
    ToolbarComponent,
    MatIconButton,
    MatButton,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexDirective,
    FlexModule,
    MatFormField,
    MatLabel,
    MatInput,
    CdkTextareaAutosize,
    MatCheckbox,
    MatSelect,
    MatOption,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    AsyncPipe,
    CircleIconButtonComponent,
  ],
})
export class OfferEditComponent
  extends BaseEditComponent<Offer>
  implements OnInit, OnDestroy, DirtyAware {
  navigationTarget = "job";
  jobId: number;
  offerGroup: UntypedFormGroup;
  submitted: boolean;
  vatOptions$: Observable<Vat[]>;
  hiddenDescriptives: number[];
  title = "Angebot: Bearbeiten";
  buttons: CustomButton[] = [];
  subscription: Subscription;

  constructor(
    api: DefaultService,
    router: Router,
    route: ActivatedRoute,
    private file: FileService,
    private currency: CurrencyPipe,
    private dialog: MatDialog,
  ) {
    super(api, router, route);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedOfferOfferIslockedOfferIdGet(id);

  dataFunction = (api: DefaultService, id: number): Observable<Offer> =>
    api.readOfferOfferOfferIdGet(id);

  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.lockOfferOfferUnlockOfferIdPost(id);

  ngOnInit(): void {
    this.initOfferGroup();
    super.ngOnInit();
    this.subscription = new Subscription();
    this.vatOptions$ = this.api.readVatsVatGet();
    this.hiddenDescriptives = [];
    if (this.createMode) {
      this.routeParams.subscribe((params) => {
        this.jobId = parseInt(params.job_id, 10);
        if (isNaN(this.jobId)) {
          console.error("OfferEdit: Cannot determine job id");
          this.router.navigateByUrl(this.navigationTarget);
        }
        this.navigationTarget = "job/" + this.jobId.toString();
        this.api
          .readJobJobJobIdGet(this.jobId)
          .pipe(first())
          .subscribe((job) => {
            this.fillRightSidebar(job.client.language.code);
          });
      });
    }
    if (this.createMode) {
      this.title = "Angebot: Erstellen";
    }

    this.buttons.push({
      name: "Angebot löschen",
      navigate: (): void => {
        this.onOfferDeleteClicked();
      },
    });
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subscription.unsubscribe();
  }

  onSubmit(): void {
    this.submitted = true;
    const descriptiveArticles = [];
    this.getDescriptiveArticles().controls.forEach(
      (descriptiveArticleControl) => {
        const subDescriptiveArticleArray: DescriptiveArticleCreate[] = [];
        this.getSubDescriptiveArticles(
          descriptiveArticleControl,
        ).controls.forEach((subDescriptiveArticleControl) => {
          const subDescriptiveArticle: DescriptiveArticleCreate = {
            name: "",
            amount: subDescriptiveArticleControl.get("amount").value,
            description: subDescriptiveArticleControl.get("description").value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            single_price:
            subDescriptiveArticleControl.get("single_price").value,
            discount: 0,
            alternative: subDescriptiveArticleControl.get("alternative").value,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            vat_id: 1,
          };
          subDescriptiveArticleArray.push(subDescriptiveArticle);
        });
        const descriptiveArticle: DescriptiveArticleCreate = {
          name: "",
          amount: 0,
          description: descriptiveArticleControl.get("description").value,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          single_price: 0,
          discount: 0,
          alternative: false,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          descriptive_articles: subDescriptiveArticleArray,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          vat_id: 1,
        };
        descriptiveArticles.push(descriptiveArticle);
      },
    );

    if (this.createMode) {
      const offerCreate: OfferCreate = {
        date: formatDateTransport(this.offerGroup.get("date").value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        in_price_included: this.offerGroup.get("in_price_included").value,
        validity: this.offerGroup.get("validity").value,
        payment: this.offerGroup.get("payment").value,
        delivery: this.offerGroup.get("delivery").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: this.jobId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: this.offerGroup.get("vat_id").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        descriptive_articles: descriptiveArticles,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_amount: this.offerGroup.get("discount_amount").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_percentage: this.offerGroup.get("discount_percentage").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_description: this.offerGroup.get("material_description").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_description_title: this.offerGroup.get(
          "material_description_title",
        ).value,
      };
      this.api
        .createOfferOfferPost(offerCreate)
        .pipe(first())
        .subscribe(
          (offer) => {
            this.createUpdateSuccess(offer);
          },
          (error) => {
            this.createUpdateError(error);
          },
          () => {
            this.createUpdateComplete();
          },
        );
    } else {
      const offerUpdate: OfferUpdate = {
        date: formatDateTransport(this.offerGroup.get("date").value),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        in_price_included: this.offerGroup.get("in_price_included").value,
        validity: this.offerGroup.get("validity").value,
        payment: this.offerGroup.get("payment").value,
        delivery: this.offerGroup.get("delivery").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        descriptive_articles: descriptiveArticles,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: this.offerGroup.get("vat_id").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_amount: this.offerGroup.get("discount_amount").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        discount_percentage: this.offerGroup.get("discount_percentage").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_description: this.offerGroup.get("material_description").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        material_description_title: this.offerGroup.get(
          "material_description_title",
        ).value,
      };
      this.api.updateOfferOfferOfferIdPut(this.id, offerUpdate).subscribe(
        (offer) => {
          this.createUpdateSuccess(offer);
        },
        (error) => {
          this.createUpdateError(error);
        },
        () => {
          this.createUpdateComplete();
        },
      );
    }
  }

  createUpdateSuccess(offer: Offer): void {
    this.id = offer.id;
    this.file.open(offer.pdf);
    this.resetDirtyState();
    this.router.navigateByUrl("job/" + this.jobId.toString(), {
      replaceUrl: true,
    });
  }

  observableReady(): void {
    super.observableReady();
    if (!this.createMode) {
      this.data$
        .pipe(
          tap((offer) =>
            this.offerGroup.patchValue(offer, { emitEvent: false }),
          ),
        )
        .subscribe((offer) => {
          this.getDescriptiveArticles().removeAt(0);
          offer.descriptive_articles.forEach((descriptiveArticle) => {
            this.getDescriptiveArticles().push(
              this.initDescriptiveArticles(descriptiveArticle),
            );
          });
          this.offerGroup.patchValue(
            {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              in_price_included: offer.in_price_included,
              validity: offer.validity,
              payment: offer.payment,
              delivery: offer.delivery,
              //date: offer.date, //remove this line if always today's date should be shown -> and vice versa
              // eslint-disable-next-line @typescript-eslint/naming-convention
              discount_amount: offer.discount_amount,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              discount_percentage: offer.discount_percentage,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              vat_id: offer.vat.id,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              material_description: offer.material_description,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              material_description_title: offer.material_description_title,
            },
            { emitEvent: false },
          );
          this.jobId = offer.job_id;
          this.recalculateOfferPrice();
          this.markTreePristine(this.offerGroup);
          this.registerDirtyControls([this.offerGroup]);
        });
    } else {
      this.markTreePristine(this.offerGroup);
      this.registerDirtyControls([this.offerGroup]);
    }
  }

  getDescriptiveArticles(): UntypedFormArray {
    return this.offerGroup.get("descriptive_articles") as UntypedFormArray;
  }

  getSubDescriptiveArticles(formGroup: AbstractControl): UntypedFormArray {
    return formGroup.get("sub_descriptive_articles") as UntypedFormArray;
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
    this.hiddenDescriptives = this.hiddenDescriptives.filter(
      (idx) => idx !== index,
    );
    if (oldLength === this.hiddenDescriptives.length) {
      this.hiddenDescriptives.push(index);
    }
  }

  isHidden(index: number | undefined): boolean {
    if (index === -1) {
      return (
        this.getDescriptiveArticles().controls.length ===
        this.hiddenDescriptives.length
      );
    }
    return this.hiddenDescriptives.filter((idx) => idx === index).length !== 0;
  }

  removeDescriptiveArticle(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Position löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getDescriptiveArticles().removeAt(index);
      }
    });
  }

  addDescriptiveArticleAt(index: number): void {
    this.getDescriptiveArticles().insert(
      index + 1,
      this.initDescriptiveArticles(),
    );
  }

  moveDescriptiveArticleUp(index: number): void {
    if (index === 0) return;

    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index - 1, descriptiveArticle);
  }

  moveDescriptiveArticleDown(index: number): void {
    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index + 1, descriptiveArticle);
  }

  async confirmDiscard(): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Änderungen verwerfen?",
        text: "Du hast ungespeicherte Änderungen. Willst du diese wirklich verwerfen?",
        confirm: "Verwerfen",
        cancel: "Abbrechen",
      },
    });

    return await dialogRef.afterClosed().toPromise();
  }

  removeDescriptiveSubArticle(
    descriptiveArticleControl: AbstractControl,
    j: number,
  ): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Position löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getSubDescriptiveArticles(descriptiveArticleControl).removeAt(j);
      }
    });
  }

  discountChanged(): void {
    this.recalculateOfferPrice();
  }

  addDescriptiveSubArticle(
    descriptiveArticleControl: AbstractControl,
    j: number,
  ): void {
    this.getSubDescriptiveArticles(descriptiveArticleControl).insert(
      j + 1,
      this.initSubDescriptiveArticles(),
    );
  }

  transformAmount(i: number, j: number) {
    const subDescriptiveArticle = this.getSubDescriptiveArticles(
      this.getDescriptiveArticles().at(i),
    ).at(j);
    const singlePrice = parseFloat(
      subDescriptiveArticle
        .get("singlePriceFormatted")
        .value.replace("€", "")
        .replace(".", "")
        .replace(",", "."),
    );
    const formattedAmount = this.currency.transform(
      singlePrice,
      getLocaleCurrencyCode("de_DE"),
    );
    subDescriptiveArticle
      .get("single_price")
      .setValue(singlePrice, { emitEvent: false });
    subDescriptiveArticle
      .get("singlePriceFormatted")
      .setValue(formattedAmount, { emitEvent: false });
  }

  private initDescriptiveArticles(
    descriptiveArticle?: DescriptiveArticle,
  ): UntypedFormGroup {
    if (descriptiveArticle === undefined) {
      return new UntypedFormGroup({
        description: new UntypedFormControl(""),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        sub_descriptive_articles: new UntypedFormArray([
          this.initSubDescriptiveArticles(),
        ]),
      });
    } else {
      const subDescriptiveArticles: UntypedFormGroup[] = [];
      descriptiveArticle.descriptive_article.forEach(
        (subDescriptiveArticle) => {
          subDescriptiveArticles.push(
            this.initSubDescriptiveArticles(subDescriptiveArticle),
          );
        },
      );
      return new UntypedFormGroup({
        description: new UntypedFormControl(descriptiveArticle.description),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        sub_descriptive_articles: new UntypedFormArray(subDescriptiveArticles),
      });
    }
  }

  private initSubDescriptiveArticles(
    subDescriptiveArticle?: DescriptiveArticle,
  ): UntypedFormGroup {
    let subDescriptiveArticleGroup;
    if (subDescriptiveArticle === undefined) {
      subDescriptiveArticleGroup = new UntypedFormGroup({
        description: new UntypedFormControl(""),
        amount: new UntypedFormControl(1),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: new UntypedFormControl(0.0),
        singlePriceFormatted: new UntypedFormControl("0,00 €"),
        alternative: new UntypedFormControl(false),
      });
    } else {
      subDescriptiveArticleGroup = new UntypedFormGroup({
        description: new UntypedFormControl(subDescriptiveArticle.description),
        amount: new UntypedFormControl(subDescriptiveArticle.amount),
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: new UntypedFormControl(
          subDescriptiveArticle.single_price,
        ),
        singlePriceFormatted: new UntypedFormControl(
          this.currency.transform(
            subDescriptiveArticle.single_price,
            getLocaleCurrencyCode("de_DE"),
          ),
        ),
        alternative: new UntypedFormControl(subDescriptiveArticle.alternative),
      });
    }

    this.subscription.add(
      subDescriptiveArticleGroup
        .get("single_price")
        .valueChanges.subscribe(() => {
        this.recalculateOfferPrice();
      }),
    );
    this.subscription.add(
      subDescriptiveArticleGroup.get("amount").valueChanges.subscribe(() => {
        this.recalculateOfferPrice();
      }),
    );
    this.subscription.add(
      subDescriptiveArticleGroup
        .get("alternative")
        .valueChanges.subscribe(() => {
        this.recalculateOfferPrice();
      }),
    );
    return subDescriptiveArticleGroup;
  }

  private onOfferDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Angebot löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.createMode) {
          this.api
            .deleteOfferOfferOfferIdDelete(this.id)
            .pipe(first())
            .subscribe((success) => {
              if (success) {
                this.router.navigateByUrl("job/" + this.jobId.toString(), {
                  replaceUrl: true,
                });
              }
            });
        } else {
          this.router.navigateByUrl("job/" + this.jobId.toString(), {
            replaceUrl: true,
          });
        }
      }
    });
  }

  private fillRightSidebar(langCode: string): void {
    const langCodeLower = langCode.toLowerCase();
    this.getAndFillParameters(
      "in_price_included",
      "offer_in_price_included_" + langCodeLower,
    );
    this.getAndFillParameters("validity", "offer_validity_" + langCodeLower);
    this.getAndFillParameters("delivery", "offer_delivery_" + langCodeLower);
    this.getAndFillParameters("payment", "offer_payment_" + langCodeLower);
  }

  private getAndFillParameters(formControlName: string, key: string) {
    this.api
      .getParameterParameterKeyGet(key)
      .pipe(first())
      .subscribe((parameter) => {
        this.offerGroup.patchValue(
          {
            [formControlName]: parameter,
          },
          { emitEvent: false },
        );
      });
  }

  private initOfferGroup() {
    this.offerGroup = new UntypedFormGroup({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      in_price_included: new UntypedFormControl(""),
      validity: new UntypedFormControl(""),
      payment: new UntypedFormControl(""),
      delivery: new UntypedFormControl(""),
      date: new UntypedFormControl(new Date().toISOString()),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      vat_id: new UntypedFormControl(3),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      discount_amount: new UntypedFormControl(0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      discount_percentage: new UntypedFormControl(0.0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      material_description: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      material_description_title: new UntypedFormControl(
        "Allgemeine Materialbeschreibung",
      ),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      descriptive_articles: new UntypedFormArray([
        this.initDescriptiveArticles(),
      ]),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      offer_price: new UntypedFormControl(""),
    });
  }

  private recalculateOfferPrice(): void {
    if (this.offerGroup.get("discount_amount").value == null) {
      this.offerGroup.get("discount_amount").setValue(0);
    }
    if (this.offerGroup.get("discount_percentage").value == null) {
      this.offerGroup.get("discount_percentage").setValue(0);
    }
    let offerPrice = 0.0;
    this.getDescriptiveArticles().controls.forEach(
      (descriptiveArticleControl) => {
        (
          descriptiveArticleControl.get(
            "sub_descriptive_articles",
          ) as UntypedFormArray
        ).controls.forEach((subDescriptiveArticleControl) => {
          if (subDescriptiveArticleControl.get("alternative").value) {
            return;
          }
          offerPrice +=
            parseFloat(subDescriptiveArticleControl.get("single_price").value) *
            parseFloat(subDescriptiveArticleControl.get("amount").value);
        });
      },
    );
    offerPrice -= this.offerGroup.get("discount_amount").value;
    offerPrice *= 1 - this.offerGroup.get("discount_percentage").value / 100;
    this.offerGroup
      .get("offer_price")
      .setValue(
        this.currency.transform(offerPrice, getLocaleCurrencyCode("de_DE")),
        { emitEvent: false },
      );
  }
}

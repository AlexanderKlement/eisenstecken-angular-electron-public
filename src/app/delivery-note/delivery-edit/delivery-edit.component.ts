import { Component, OnInit } from "@angular/core";
import { BaseEditComponent } from "../../shared/components/base-edit/base-edit.component";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthService } from "../../shared/services/auth.service";
import { CustomButton, ToolbarComponent } from "../../shared/components/toolbar/toolbar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { formatDateTransport } from "../../shared/date.util";
import { FileService } from "../../shared/services/file.service";
import {
  DeliveryNoteCreate,
  DeliveryNote,
  DeliveryNoteUpdate,
  DeliveryNoteReason,
  Lock,
  DefaultService,
  DescriptiveArticle,
  DescriptiveArticleCreate
} from "../../../api/openapi";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective, FlexModule } from "ng-flex-layout";
import { MatIconButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel, MatInput, MatSuffix } from "@angular/material/input";
import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from "@angular/material/datepicker";
import { MatCheckbox } from "@angular/material/checkbox";
import { AsyncPipe } from "@angular/common";

export interface JobMinimal {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  displayable_name: string;
  id: number;
}

@Component({
    selector: 'app-delivery-edit',
    templateUrl: './delivery-edit.component.html',
    styleUrls: ['./delivery-edit.component.scss'],
    imports: [ToolbarComponent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective, FlexModule, MatIconButton, MatButton, MatIcon, MatFormField, MatLabel, CdkTextareaAutosize, MatInput, MatSelect, MatOption, MatDatepickerInput, MatDatepickerToggle, MatSuffix, MatDatepicker, MatCheckbox, AsyncPipe]
})
export class DeliveryEditComponent extends BaseEditComponent<DeliveryNote> implements OnInit {
  deliveryNoteGroup: UntypedFormGroup;
  submitted = false;
  navigationTarget = "delivery_note";
  essentialJobList: Observable<JobMinimal[]>;
  deliveryNoteReasons: Observable<DeliveryNoteReason[]>;
  buttons: CustomButton[] = [];
  title = "Lieferschein: Bearbeiten";

  constructor(api: DefaultService, router: Router, route: ActivatedRoute,
              private authService: AuthService, private snackBar: MatSnackBar, private file: FileService, private dialog: MatDialog) {
    super(api, router, route);
  }

  lockFunction = (api: DefaultService, id: number): Observable<Lock> =>
    api.islockedDeliveryNoteDeliveryNoteIslockedDeliveryNoteIdGet(id);

  dataFunction = (api: DefaultService, id: number): Observable<DeliveryNote> =>
    api.readDeliveryNoteDeliveryNoteDeliveryNoteIdGet(id);

  unlockFunction = (api: DefaultService, id: number): Observable<boolean> =>
    api.unlockDeliveryNoteDeliveryNoteUnlockDeliveryNoteIdPost(id);


  ngOnInit(): void {
    super.ngOnInit();
    this.initDeliveryNoteGroup();
    this.essentialJobList = this.api.readJobsJobGet(0, 100, "", undefined, "JOBSTATUS_ACCEPTED", true).pipe(map(
      jobs => {
        const minimalJobs: JobMinimal[] = jobs;
        minimalJobs.splice(0, 0, {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          displayable_name: "Selbst eintragen",
          id: 0,
        });
        return minimalJobs;
      },
    ));
    this.deliveryNoteReasons = this.api.readDeliveryNoteReasonsDeliveryNoteReasonsGet();
    if (this.createMode) {
      this.api.getNextDeliveryNoteNumberDeliveryNoteNumberGet().pipe(first()).subscribe(deliveryNoteNumber => {
        this.deliveryNoteGroup.get("delivery_note_number").setValue(deliveryNoteNumber);
      });
      this.addDescriptiveArticleAt(0);
    } else {
      this.authService.currentUserHasRight("delivery_notes:delete").pipe(first()).subscribe(allowed => {
        if (allowed) {
          this.buttons.push({
            name: "Lieferschein löschen",
            navigate: () => {
              this.deliveryNoteDeleteClicked();
            },
          });
        }
      });
    }
    if (this.createMode) {
      this.title = "Lieferschein: Erstellen";
    }
  }

  onSubmit() {
    this.submitted = true;
    const descriptiveArticles: DescriptiveArticleCreate[] = [];
    for (const article of this.getDescriptiveArticles().controls) {
      descriptiveArticles.push({
        name: article.get("description").value,
        amount: parseFloat(article.get("amount").value),
        description: article.get("description").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        single_price: 0.0,
        discount: 0,
        alternative: false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        vat_id: 1,
      });
    }
    if (this.createMode) {
      const deliveryNoteCreate: DeliveryNoteCreate = {
        // eslint-disable-next-line id-blacklist
        number: this.deliveryNoteGroup.get("delivery_note_number").value,
        date: formatDateTransport(this.deliveryNoteGroup.get("date").value),
        name: this.deliveryNoteGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delivery_address: this.deliveryNoteGroup.get("delivery_address").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        company_address: this.deliveryNoteGroup.get("company_address").value,
        variations: this.deliveryNoteGroup.get("variations").value,
        weight: this.deliveryNoteGroup.get("weight").value,
        freight: this.deliveryNoteGroup.get("freight").value,
        free: this.deliveryNoteGroup.get("free").value,
        assigned: this.deliveryNoteGroup.get("assigned").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: this.deliveryNoteGroup.get("job_id").value,
        articles: descriptiveArticles,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delivery_note_reason_id: this.deliveryNoteGroup.get("delivery_note_reason_id").value,
      };
      this.api.createDeliveryNoteDeliveryNotePost(deliveryNoteCreate).pipe(first()).subscribe(deliveryNote => {
        this.submitted = false;
        this.file.open(deliveryNote.pdf);
        this.router.navigateByUrl("delivery_note", { replaceUrl: true });
      }, (err) => {
        this.createUpdateError(err);
      }, () => {
        this.createUpdateComplete();
      });
    } else {
      const deliveryNoteUpdate: DeliveryNoteUpdate = {
        // eslint-disable-next-line id-blacklist
        number: this.deliveryNoteGroup.get("delivery_note_number").value,
        date: formatDateTransport(this.deliveryNoteGroup.get("date").value),
        name: this.deliveryNoteGroup.get("name").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delivery_address: this.deliveryNoteGroup.get("delivery_address").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        company_address: this.deliveryNoteGroup.get("company_address").value,
        variations: this.deliveryNoteGroup.get("variations").value,
        weight: this.deliveryNoteGroup.get("weight").value,
        freight: this.deliveryNoteGroup.get("freight").value,
        free: this.deliveryNoteGroup.get("free").value,
        assigned: this.deliveryNoteGroup.get("assigned").value,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        job_id: this.deliveryNoteGroup.get("job_id").value,
        articles: descriptiveArticles,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        delivery_note_reason_id: this.deliveryNoteGroup.get("delivery_note_reason_id").value,
      };
      this.api.updateDeliveryNoteDeliveryNoteDeliveryNoteIdPut(this.id, deliveryNoteUpdate).pipe(first()).subscribe(deliveryNote => {
        this.submitted = false;
        this.file.open(deliveryNote.pdf);
        this.router.navigateByUrl("delivery_note", { replaceUrl: true });
      }, (err) => {
        this.createUpdateError(err);
      }, () => {
        this.createUpdateComplete();
      });
    }
  }

  addDescriptiveArticleAt(index: number) {
    this.getDescriptiveArticles().insert(index + 1, this.initDescriptiveArticles());
  }

  moveDescriptiveArticleUp(index: number) {
    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index - 1, descriptiveArticle);
  }

  moveDescriptiveArticleDown(index: number) {
    const descriptiveArticle = this.getDescriptiveArticles().at(index);
    this.getDescriptiveArticles().removeAt(index);
    this.getDescriptiveArticles().insert(index + 1, descriptiveArticle);
  }

  getDescriptiveArticles(): UntypedFormArray {
    return this.deliveryNoteGroup.get("articles") as UntypedFormArray;
  }

  removeDescriptiveArticle(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Position löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getDescriptiveArticles().removeAt(index);
      }
    });
  }

  selectedJobChanged() {
    const jobId = this.deliveryNoteGroup.get("job_id").value;
    if (jobId === 0) {
      this.deliveryNoteGroup.get("name").setValue("");
      this.deliveryNoteGroup.get("company_address").setValue("");
      this.deliveryNoteGroup.get("delivery_address").setValue("");
    } else {
      this.api.readJobJobJobIdGet(jobId).pipe(first()).subscribe(job => {
        this.deliveryNoteGroup.get("name").setValue(job.client.fullname);
        const address = job.client.address.address_2 + " " + job.client.address.address_1;
        this.deliveryNoteGroup.get("company_address").setValue(address);
        this.deliveryNoteGroup.get("delivery_address").setValue(address);
      });
    }
  }

  protected observableReady() {
    super.observableReady();
    this.data$.pipe(first()).subscribe(deliveryNote => {
      this.deliveryNoteGroup.patchValue(deliveryNote);
      this.deliveryNoteGroup.get("delivery_note_number").setValue(deliveryNote.number);
      for (const article of deliveryNote.articles) {
        this.getDescriptiveArticles().push(this.initDescriptiveArticles(article));
      }
      if (this.getDescriptiveArticles().controls.length === 0) {
        this.getDescriptiveArticles().push(this.initDescriptiveArticles());
      }
      this.deliveryNoteGroup.get("delivery_note_reason_id").setValue(deliveryNote.delivery_note_reason.id);
    });
  }

  protected initDescriptiveArticles(descriptiveArticle?: DescriptiveArticle): UntypedFormGroup {
    if (descriptiveArticle === undefined) {
      return new UntypedFormGroup({
        description: new UntypedFormControl("", Validators.required),
        amount: new UntypedFormControl("", Validators.required),
      });
    } else {
      return new UntypedFormGroup({
        description: new UntypedFormControl(descriptiveArticle.description, Validators.required),
        amount: new UntypedFormControl(descriptiveArticle.amount, Validators.required),
      });
    }
  }


  private initDeliveryNoteGroup(): void {
    const now = new Date();
    this.deliveryNoteGroup = new UntypedFormGroup({
      date: new UntypedFormControl(now.toISOString()),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      delivery_note_number: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      name: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      company_address: new UntypedFormControl(""),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      delivery_address: new UntypedFormControl(""),
      variations: new UntypedFormControl(""),
      articles: new UntypedFormArray([]),
      weight: new UntypedFormControl(""),
      freight: new UntypedFormControl(false),
      free: new UntypedFormControl(false),
      assigned: new UntypedFormControl(false),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      job_id: new UntypedFormControl(0),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      delivery_note_reason_id: new UntypedFormControl(3),
    });
  }

  private deliveryNoteDeleteClicked() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Lieferschein löschen?",
        text: "Den Lieferschein löschen? Diese Aktion kann NICHT rückgängig gemacht werden!",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteDeliveryNoteDeliveryNoteDeliveryNoteIdDelete(this.id).pipe(first()).subscribe(success => {
          if (success) {
            this.router.navigateByUrl("delivery_note");
          } else {
            this.snackBar.open("Lieferschein konnte nicht gelöscht werden", "Ok", {
              duration: 10000,
            });
          }
        });

      }
    });
  }
}

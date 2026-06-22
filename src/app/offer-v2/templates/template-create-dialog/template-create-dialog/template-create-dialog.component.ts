import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { OfferTemplateEntryCreatePatch, OfferV2Service } from "../../../../../api/openapi";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { convertTemplateEntryRecursive, TemplateGroup } from "../../templates-edit/offer-templates-edit.component";
import { mapTemplateEntryGroupFromInput } from "../../templates-edit/template-entry-edit/template-entry-edit.component";
import {
  DefaultFlexDirective,
  DefaultLayoutAlignDirective,
  DefaultLayoutDirective,
  DefaultLayoutGapDirective,
  FlexModule
} from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { AsyncPipe } from "@angular/common";
import { MatButton } from "@angular/material/button";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { BehaviorSubject } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { take } from "rxjs/operators";

interface TemplateCreateData {
  structure?: OfferTemplateEntryCreatePatch[];
}

@Component({
  selector: "app-template-create-dialog",
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    DefaultLayoutAlignDirective,
    DefaultLayoutDirective,
    DefaultFlexDirective,
    DefaultLayoutGapDirective,
    MatFormField,
    MatInput,
    MatLabel,
    AsyncPipe,
    FlexModule,
    MatButton,
    MatDialogActions,
    MatProgressSpinner
  ],
  templateUrl: "./template-create-dialog.component.html",
  styleUrl: "./template-create-dialog.component.scss"
})
export class TemplateCreateDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<TemplateCreateDialogComponent>>(MatDialogRef);
  data = inject<TemplateCreateData>(MAT_DIALOG_DATA);
  private offerService = inject(OfferV2Service);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  private snackBar = inject(MatSnackBar);
  templateGroup: FormGroup<TemplateGroup> = new FormGroup({
    name: new FormControl(""),
    description: new FormControl(""),
    structure: new FormArray([])
  });

  ngOnInit(): void {
    if (this.data?.structure) {
      this.templateGroup.controls.structure = new FormArray(this.data.structure.map(mapTemplateEntryGroupFromInput));
    }
  }

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  subscription = {
    next: () => {
      this.loadingSubject.next(false);
      this.dialogRef.close(true);
    },
    error: (error: any) => {
      this.loadingSubject.next(false);
      this.snackBar.open("Etwas ist schief gelaufen: " + error, "Ok", { duration: 8000 });
    }
  };

  onSubmitClick() {
    if (this.templateGroup.valid) {
      this.loadingSubject.next(true);
      const structure = convertTemplateEntryRecursive(this.templateGroup.controls.structure);
      this.offerService.createOfferTemplateOfferV2TemplatePut({
        name: this.templateGroup.get("name").value,
        description: this.templateGroup.get("description").value,
        structure
      }).pipe(take(1)).subscribe(this.subscription);
    }
  }
}

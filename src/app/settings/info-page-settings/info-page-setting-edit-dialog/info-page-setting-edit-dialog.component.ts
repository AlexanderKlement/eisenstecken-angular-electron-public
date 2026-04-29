import { Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthStateService } from "../../../shared/services/auth-state.service";
import { DefaultService, InfoPageUpdate, InfoPageCreate, ScopeEnum } from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

export interface InfoPageEditDialogData {
  id: number;
}


@Component({
    selector: 'app-info-page-setting-edit-dialog',
    templateUrl: './info-page-setting-edit-dialog.component.html',
    styleUrls: ['./info-page-setting-edit-dialog.component.scss'],
    imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class InfoPageSettingEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<InfoPageEditDialogData>>(MatDialogRef);
  dialog = inject(MatDialog);
  private authService = inject(AuthStateService);
  data = inject<InfoPageEditDialogData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);

  title: string;
  createMode = true;
  infoPageGroup: UntypedFormGroup;
  showDeleteButton = false;
  id: number;


  ngOnInit(): void {
    this.id = this.data.id;
    this.createMode = this.id < 1;
    this.infoPageGroup = new UntypedFormGroup({
      name: new UntypedFormControl(""),
      body: new UntypedFormControl(""),
    });
    if (!this.createMode) {
      this.api.readInfoPageInfoPageInfoPageIdGet(this.id).pipe(first()).subscribe((infoPage) => {
        this.infoPageGroup.get("name").setValue(infoPage.name);
        this.infoPageGroup.get("body").setValue(infoPage.body);
      });

    }
    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe((access) => {
      if (access && !this.createMode) {
        this.showDeleteButton = true;
      }
    });

  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    if (this.createMode) {
      const infoPageCreate: InfoPageCreate = {
        body: this.infoPageGroup.get("body").value,
        name: this.infoPageGroup.get("name").value,
      };
      this.api.createInfoPageInfoPagePost(infoPageCreate).pipe(first()).subscribe((infoPage) => {
        this.id = infoPage.id;
        this.dialogRef.close();
      });
    } else {
      const infoPageUpdate: InfoPageUpdate = {
        body: this.infoPageGroup.get("body").value,
        name: this.infoPageGroup.get("name").value,
      };
      this.api.updateInfoPageInfoPageInfoPageIdPut(this.id, infoPageUpdate).pipe(first()).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onDeleteClick() {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Informations-Seite löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden.",
      },
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteInfoPageInfoPageInfoPageIdDelete(this.id).pipe(first()).subscribe(() => {
          this.dialogRef.close();
        });
      }
    });

  }
}

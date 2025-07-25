import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../../shared/services/auth.service';
import {
  DefaultService,
  InfoPageCreate,
  InfoPageUpdate,
} from '../../../../client/api';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';

export interface InfoPageEditDialogData {
  id: number;
}

@Component({
  selector: 'app-info-page-setting-edit-dialog',
  templateUrl: './info-page-setting-edit-dialog.component.html',
  styleUrls: ['./info-page-setting-edit-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    NgIf,
  ],
})
export class InfoPageSettingEditDialogComponent implements OnInit {
  title: string;
  createMode = true;
  infoPageGroup: UntypedFormGroup;
  showDeleteButton = false;
  id: number;

  constructor(
    public dialogRef: MatDialogRef<InfoPageEditDialogData>,
    public dialog: MatDialog,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: InfoPageEditDialogData,
    private api: DefaultService
  ) {}

  ngOnInit(): void {
    this.id = this.data.id;
    this.createMode = this.id < 1;
    this.infoPageGroup = new UntypedFormGroup({
      name: new UntypedFormControl(''),
      body: new UntypedFormControl(''),
    });
    if (!this.createMode) {
      this.api
        .readInfoPageInfoPageIdGet(this.id)
        .pipe(first())
        .subscribe(infoPage => {
          this.infoPageGroup.get('name').setValue(infoPage.name);
          this.infoPageGroup.get('body').setValue(infoPage.body);
        });
    }
    this.authService
      .currentUserHasRight('info_pages:delete')
      .pipe(first())
      .subscribe(access => {
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
        body: this.infoPageGroup.get('body').value,
        name: this.infoPageGroup.get('name').value,
      };
      this.api
        .createInfoPageInfoPagePost(infoPageCreate)
        .pipe(first())
        .subscribe(infoPage => {
          this.id = infoPage.id;
          this.dialogRef.close();
        });
    } else {
      const infoPageUpdate: InfoPageUpdate = {
        body: this.infoPageGroup.get('body').value,
        name: this.infoPageGroup.get('name').value,
      };
      this.api
        .updateInfoPageInfoPageIdPut(this.id, infoPageUpdate)
        .pipe(first())
        .subscribe(() => {
          this.dialogRef.close();
        });
    }
  }

  onDeleteClick() {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Informations-Seite löschen?',
        text: 'Dieser Schritt kann nicht rückgängig gemacht werden.',
      },
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api
          .deleteInfoPageInfoPageIdDelete(this.id)
          .pipe(first())
          .subscribe(() => {
            this.dialogRef.close();
          });
      }
    });
  }
}

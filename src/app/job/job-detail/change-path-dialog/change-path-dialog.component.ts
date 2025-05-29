import { Component, Inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { FileService } from '../../../shared/services/file.service';
import { DefaultService } from '../../../../client/api';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: 'app-change-path-dialog',
  templateUrl: './change-path-dialog.component.html',
  styleUrls: ['./change-path-dialog.component.scss'],
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatInput,
    MatButton,
    MatDialogActions,
    MatLabel,
  ],
})
export class ChangePathDialogComponent implements OnInit {
  title = 'Pfad ändern';
  changePathFormGroup: UntypedFormGroup;

  constructor(
    private api: DefaultService,
    private file: FileService,
    public dialogRef: MatDialogRef<ChangePathDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePathDialogData
  ) {}

  ngOnInit(): void {
    this.changePathFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl(''),
    });
    this.api
      .readJobJobJobIdGet(this.data.id)
      .pipe(first())
      .subscribe(job => {
        this.title += ': ' + job.displayable_name;
        this.changePathFormGroup.get('path').setValue(job.path);
      });
  }

  selectPathClicked() {
    this.file.selectFolder().then(path => {
      this.changePathFormGroup.get('path').setValue(path);
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.api
      .patchPathJobPathJobIdPut(
        this.data.id,
        this.changePathFormGroup.get('path').value
      )
      .pipe(first())
      .subscribe(() => {
        this.dialogRef.close(true);
      });
  }
}

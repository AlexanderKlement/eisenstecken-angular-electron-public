import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { FileService } from '../../../shared/services/file.service';
import { DefaultService } from '../../../../api/openapi';

export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: 'app-change-path-dialog',
  templateUrl: './change-path-dialog.component.html',
  styleUrls: ['./change-path-dialog.component.scss'],
})
export class ChangePathDialogComponent implements OnInit {
  title = 'Pfad ändern';
  changePathFormGroup: UntypedFormGroup;


  constructor(private api: DefaultService, private file: FileService,
              public dialogRef: MatDialogRef<ChangePathDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChangePathDialogData) {
  }

  ngOnInit(): void {
    this.changePathFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl(''),
    });
    this.api.readJobJobJobIdGet(this.data.id).pipe(first()).subscribe((job) => {
      this.title += ': ' + job.displayable_name;
      this.changePathFormGroup.get('path').setValue(job.path);
    });
  }

  selectPathClicked() {
    this.file.selectFolder().then((path) => {
      this.changePathFormGroup.get('path').setValue(path);
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.api.patchPathJobPathJobIdPut(this.data.id, this.changePathFormGroup.get('path').value)
      .pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}

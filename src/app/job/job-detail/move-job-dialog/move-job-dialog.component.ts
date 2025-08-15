import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { FileService } from '../../../shared/services/file.service';
import { DefaultService } from '../../../api';

export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: 'app-change-path-dialog',
  templateUrl: './move-job-dialog.component.html',
  styleUrls: ['./move-job-dialog.component.scss'],
})
export class MoveJobDialogComponent implements OnInit {
  title = 'Jahr verschieben';
  moveJobFormGroup: UntypedFormGroup;


  constructor(private api: DefaultService, private file: FileService,
              public dialogRef: MatDialogRef<MoveJobDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ChangePathDialogData) {
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    this.moveJobFormGroup = new UntypedFormGroup({
      year: new UntypedFormControl(nextYear.toString()),
    });
    this.api.readJobJobJobIdGet(this.data.id).pipe(first()).subscribe((job) => {
      this.title += ': ' + job.displayable_name;
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    this.api.moveJobToYearJobMoveJobToYearJobIdPost(this.data.id, this.moveJobFormGroup.get('year').value)
      .pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}

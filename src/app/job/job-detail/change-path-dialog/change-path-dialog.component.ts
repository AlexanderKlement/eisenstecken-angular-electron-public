import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { FileService } from '../../../shared/services/file.service';
import { DefaultService } from '../../../../api/openapi';
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from 'ng-flex-layout';
import { MatFormField, MatLabel, MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

export interface ChangePathDialogData {
  id: number;
}

@Component({
    selector: 'app-change-path-dialog',
    templateUrl: './change-path-dialog.component.html',
    styleUrls: ['./change-path-dialog.component.scss'],
    imports: [MatDialogTitle,  MatDialogContent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton, MatDialogActions]
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

import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { first } from "rxjs/operators";
import { FileService } from "../../../shared/services/file.service";
import { DefaultService } from "../../../../api/openapi";
import { DefaultLayoutAlignDirective, DefaultLayoutDirective } from "ng-flex-layout";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { LocalConfigRenderer } from "../../../LocalConfigRenderer";

export interface ChangePathDialogData {
  id: number;
}

@Component({
  selector: "app-change-path-dialog",
  templateUrl: "./change-path-dialog.component.html",
  styleUrls: ["./change-path-dialog.component.scss"],
  imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatButton, MatDialogActions]
})
export class ChangePathDialogComponent implements OnInit {
  private api = inject(DefaultService);
  private file = inject(FileService);
  dialogRef = inject<MatDialogRef<ChangePathDialogComponent>>(MatDialogRef);
  data = inject<ChangePathDialogData>(MAT_DIALOG_DATA);

  title = "Pfad ändern";
  changePathFormGroup: UntypedFormGroup;

  ngOnInit(): void {
    this.changePathFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl("")
    });
    this.api.readJobJobJobIdGet(this.data.id).pipe(first()).subscribe((job) => {
      this.title += ": " + job.displayable_name;
      this.changePathFormGroup.get("path").setValue(job.path);
    });
  }

  selectPathClicked() {
    this.file.selectFolder().then((path) => {
      this.changePathFormGroup.get("path").setValue(path);
    });
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSubmitClick() {
    const serverPath = LocalConfigRenderer.getInstance().replaceLocalPath(this.changePathFormGroup.get("path").value);
    this.api.patchPathJobPathJobIdPut(this.data.id, serverPath)
      .pipe(first()).subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}

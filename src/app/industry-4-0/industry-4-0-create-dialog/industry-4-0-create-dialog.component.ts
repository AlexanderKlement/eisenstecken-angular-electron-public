import { Component } from "@angular/core";
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { VietProgram, VietService } from "../../../api/openapi";
import { map, startWith } from "rxjs/operators";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";
import { MatOption, MatSelect } from "@angular/material/select";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'app-industry-4-0-create-dialog',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatSelect,
    AsyncPipe,
    MatOption,
  ],
  templateUrl: './industry-4-0-create-dialog.component.html',
  styleUrl: './industry-4-0-create-dialog.component.scss',
})
export class Industry40CreateDialogComponent {

  constructor(private viet: VietService, public dialogRef: MatDialogRef<Industry40CreateDialogComponent>) {
  }

  public readonly formGroup = new FormGroup({
    job_id: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    thickness: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    recipe: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    pieces: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  public readonly programs$ = this.viet
    .getAvailableProgramsVietAvailableProgramsGet()
    .pipe(
      map((p) => p ?? []),
      startWith([]),
    );

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    if (this.formGroup.invalid) return;

    const value = this.formGroup.getRawValue();
    this.dialogRef.close({
      job_id: value.job_id,
      thickness: value.thickness,
      recipe: value.recipe!, // safe because required validator
      pieces: value.pieces,
    });
  }

  trackByProgramId(_index: number, p: VietProgram): number {
    return p.program_id;
  }
}

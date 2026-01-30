import { Component, Inject} from "@angular/core";
import { DefaultService, Job } from "../../../../api/openapi";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { shareReplay, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatTree, MatTreeNode, MatTreeNodeDef, MatTreeNodePadding, MatTreeNodeToggle } from "@angular/material/tree";
import { MatButton } from "@angular/material/button";
import { AsyncPipe } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatInput, MatLabel } from "@angular/material/input";

export interface CreateRecalculationDialogData {
  jobId: number;
}

export interface CreateRecalculationDialogResult {
  jobIds: number[];
  materialChargePercent: number;
  name: string;
}

@Component({
  selector: 'app-create-recalculation-dialog',
  imports: [
    MatCheckbox,
    MatTree,
    MatTreeNode,
    MatTreeNodePadding,
    MatButton,
    MatTreeNodeToggle,
    MatTreeNodeDef,
    AsyncPipe,
    MatDialogTitle,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDialogContent,
    MatInput,
    MatDialogActions
  ],
  templateUrl: './create-recalculation-dialog.component.html',
  styleUrl: './create-recalculation-dialog.component.scss'
})
export class CreateRecalculationDialogComponent {
  title = "Nachkalkulation erstellen"
  mainSelected = true;
  subSelected = new Set<number>();

  materialChargePercentCtrl = new FormControl<number>(10, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(0)],
  });

  nameCtrl = new FormControl<string>("Alle", {
    nonNullable: true,
    validators: [Validators.required],
  });

  form = new FormGroup({
    materialChargePercent: this.materialChargePercentCtrl,
    name: this.nameCtrl,
  });


  constructor(private api: DefaultService,
              public dialogRef: MatDialogRef<CreateRecalculationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: CreateRecalculationDialogData) {
  }

  readonly job$: Observable<Job> = this.api
    .readJobJobJobIdGet(this.data.jobId)
    .pipe(
      tap(job => {
        // Startzustand: alles ausgewählt
        this.mainSelected = true;
        this.subSelected = new Set(job.sub_jobs.map(j => j.id));
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  get hasAnySelection(): boolean {
    return this.mainSelected || this.subSelected.size > 0;
  }

  toggleMainSelected(): void {
    this.mainSelected = !this.mainSelected;
  }

  toggleSub(id: number): void {
    if (this.subSelected.has(id)) this.subSelected.delete(id);
    else this.subSelected.add(id);
  }
  childrenAccessor = (node: Job): Job[] => node.sub_jobs ?? [];

  isMain = (_: number, node: Job) => node.is_main === true; // oder: !node.is_sub

  allSubsSelected(job: Job): boolean {
    const subs = job.sub_jobs ?? [];
    return subs.length > 0 && subs.every(s => this.subSelected.has(s.id));
  }

  someSubsSelected(job: Job): boolean {
    const subs = job.sub_jobs ?? [];
    return subs.some(s => this.subSelected.has(s.id));
  }

  onSubmitClick(): void {
    if (!this.hasAnySelection || this.form.invalid) return;

    const result: CreateRecalculationDialogResult = {
      jobIds: Array.from(this.subSelected).concat(this.mainSelected ? [this.data.jobId] : []),
      materialChargePercent: this.materialChargePercentCtrl.value,
      name: this.nameCtrl.value,
    };

    this.dialogRef.close(result);
  }



}

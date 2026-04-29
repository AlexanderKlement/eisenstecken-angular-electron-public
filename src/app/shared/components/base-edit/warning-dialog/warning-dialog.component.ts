import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from "@angular/material/dialog";
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';

export interface WarningDialogData {
  totalBlockingTime: number;
  remainingBlockingTime: number;
}

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatButton]
})
export class WarningDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<WarningDialogComponent>>(MatDialogRef);
  data = inject<WarningDialogData>(MAT_DIALOG_DATA);


  ngOnInit(): void {
  }

  onAcceptClick() :void {
    this.dialogRef.close();
  }

}

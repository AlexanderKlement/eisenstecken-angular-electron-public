import {Component, Inject, OnInit} from '@angular/core';
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

  constructor(public dialogRef: MatDialogRef<WarningDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: WarningDialogData) { }

  ngOnInit(): void {
  }

  onAcceptClick() :void {
    this.dialogRef.close();
  }

}

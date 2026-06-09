import { Component, inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";

export interface ConfirmDialogData {
  title: string;
  text: string;
}

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton]
})
export class ConfirmDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ConfirmDialogComponent>>(MatDialogRef);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);


  ngOnInit(): void {

  }

  onNoClick() {
    this.dialogRef.close(false);
  }

  onYesClick() {
    this.dialogRef.close(true);
  }
}

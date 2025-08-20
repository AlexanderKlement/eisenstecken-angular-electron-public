import {Component, Inject, OnInit} from "@angular/core";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";

export interface ConfirmDialogData {
    title: string;
    text: string;
}

@Component({
    selector: 'app-confirm-dialog',
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {


    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    }

    ngOnInit(): void {
    }

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick() {
        this.dialogRef.close(true);
    }
}

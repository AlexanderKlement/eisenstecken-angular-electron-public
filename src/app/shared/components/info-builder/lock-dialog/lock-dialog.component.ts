import { Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from "@angular/material/dialog";
import {Observable} from "rxjs";
import {first} from "rxjs/operators";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { MatButton } from "@angular/material/button";
import {Lock} from "../../../../../api/openapi"

export interface LockDialogData {
    lock: Lock;
    unlockObservable: Observable<boolean>;
}


@Component({
    selector: 'app-lock-dialog',
    templateUrl: './lock-dialog.component.html',
    styleUrls: ['./lock-dialog.component.scss'],
    imports: [CdkScrollable, MatDialogContent, MatButton]
})

export class LockDialogComponent implements OnInit {
    dialogRef = inject<MatDialogRef<LockDialogComponent>>(MatDialogRef);
    data = inject<LockDialogData>(MAT_DIALOG_DATA);


    ngOnInit(): void {
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onUnlockClick(): void {
        this.data.unlockObservable.pipe(first()).subscribe((success) => {
            if (!success) {
                console.error("LockDataDialog: Unable to unlock ressource");
            }
            this.dialogRef.close();
        });
    }
}

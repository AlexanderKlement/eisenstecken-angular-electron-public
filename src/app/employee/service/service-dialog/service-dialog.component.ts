import { Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import {ConfirmDialogComponent,} from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import {first} from "rxjs/operators";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultService, Service, ServiceUpdate} from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatButton } from "@angular/material/button";
import { MinuteHourComponent } from "../../../shared/components/minute-hour/minute-hour.component";

export interface ServiceDialogData {
    id: number;
}

@Component({
    selector: 'app-service-dialog',
    templateUrl: './service-dialog.component.html',
    styleUrls: ['./service-dialog.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatButton, MinuteHourComponent, MatDialogActions]
})
export class ServiceDialogComponent implements OnInit {
    dialogRef = inject<MatDialogRef<ServiceDialogComponent>>(MatDialogRef);
    data = inject<ServiceDialogData>(MAT_DIALOG_DATA);
    private api = inject(DefaultService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);


    service: Service;
    minutes: number;
    loading = true;
    serviceGroup: UntypedFormGroup;

    ngOnInit(): void {
        this.api.readServiceServiceServiceIdGet(this.data.id).pipe(first()).subscribe((service) => {
            this.service = service;
            this.serviceGroup = new UntypedFormGroup({
                minutes: new UntypedFormControl(service.minutes)
            });
            this.loading = false;
        });
    }

    onNoClick() {
        this.dialogRef.close(false);
    }

    onYesClick() {
        const serviceUpdate: ServiceUpdate = {
            minutes: parseInt(this.getMinuteControl().value, 10),
        };
        const serviceId = this.service.id;
        this.api.updateServiceServiceServiceIdPost(serviceId, serviceUpdate).pipe(first()).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onDeleteClick() {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: "400px",
            data: {
                title: "Service löschen?",
                text: "Service löschen? Diese Aktion kann nicht rückgängig gemacht werden!"
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.deleteServiceServiceServiceIdDelete(this.service.id).pipe(first()).subscribe(success => {
                    if (success) {
                        this.dialogRef.close(true);
                    } else {
                        this.snackBar.open("Service konnte nicht gelöscht werden", "Ok", {
                            duration: 10000
                        });
                    }
                });

            }
        });
    }

    getMinuteControl(): UntypedFormControl {
        return this.serviceGroup.get("minutes") as UntypedFormControl;
    }
}

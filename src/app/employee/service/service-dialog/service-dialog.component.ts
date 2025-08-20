import {Component, Inject, OnInit} from "@angular/core";
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from "@angular/material/legacy-dialog";
import {ConfirmDialogComponent,} from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import {first} from "rxjs/operators";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {MatLegacySnackBar as MatSnackBar} from "@angular/material/legacy-snack-bar";
import {DefaultService, Service, ServiceUpdate} from "../../../../api/openapi";

export interface ServiceDialogData {
    id: number;
}

@Component({
    selector: 'app-service-dialog',
    templateUrl: './service-dialog.component.html',
    styleUrls: ['./service-dialog.component.scss']
})
export class ServiceDialogComponent implements OnInit {

    service: Service;
    minutes: number;
    loading = true;
    serviceGroup: UntypedFormGroup;

    constructor(public dialogRef: MatDialogRef<ServiceDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: ServiceDialogData,
                private api: DefaultService, private snackBar: MatSnackBar,
                private dialog: MatDialog) {
    }

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

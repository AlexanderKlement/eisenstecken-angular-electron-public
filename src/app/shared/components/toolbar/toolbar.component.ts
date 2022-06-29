import {Component, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {ListenerService} from '../../services/listener.service';
import {AbstractControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

export interface CustomButton {
    name: string;
    navigate: VoidFunction;
}

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() buttonList?: CustomButton[];
    @Input() beforeBackFunction?: (afterBackFunction: VoidFunction) => void;
    @Input() title = '';
    @Input() showBackButton = true;
    @Input() showLogoutButton = false;
    @Input() controlsBeforeBack: AbstractControl[] = [];

    private subscription: Subscription;
    private atLeastOneFormModified = false;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(private navigation: NavigationService, private dialog: MatDialog, private authService: AuthService, private listener: ListenerService) {
    }


    ngOnInit(): void {
        this.subscription = new Subscription();
        for (const outerControl of this.controlsBeforeBack) {
            this.subscription.add(outerControl.valueChanges.subscribe((value) => {
                for (const innerControl of this.controlsBeforeBack) {
                    if (innerControl.dirty) {
                        this.formDirty();
                        break;
                    }
                }
            }));
        }
    }

    formDirty(): void {
        this.subscription.unsubscribe();
        this.atLeastOneFormModified = true;
        this.listener.blockAndNotifyBack().subscribe(() => {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                data: {
                    title: 'Änderungen verwerfen?',
                    text: 'Mindestens ein Eingabefeld wurde bearbeitet.'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.listener.navigationBackAllowed = true;
                    this.navigation.back();
                } else {
                    console.log('Hier könnte ihr popstate stehen');
                }
            });
        });
    }

    homeClicked(): void {
        if (this.atLeastOneFormModified) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                data: {
                    title: 'Änderungen verwerfen?',
                    text: 'Mindestens ein Eingabefeld wurde bearbeitet.'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.navigation.home();
                } else {
                    console.log('Hier könnte ihr popstate stehen');
                }
            });
        } else {
            this.navigation.home();
        }
    }

    buttonClicked(button: CustomButton): void {
        button.navigate();
    }

    backButtonClicked(): void {
        if (this.atLeastOneFormModified) {
            const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                width: '400px',
                data: {
                    title: 'Änderungen verwerfen?',
                    text: 'Mindestens ein Eingabefeld wurde bearbeitet.'
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.navigation.back();
                } else {
                    console.log('Hier könnte ihr popstate stehen');
                }
            });
        } else {
            this.navigation.back();
        }
    }

    logoutClicked(): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            width: '400px',
            data: {
                title: 'Abmelden?',
                text: 'Soll der Benutzer abgemeldet werden?'
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.authService.doLogout();
            }
        });
    }

}

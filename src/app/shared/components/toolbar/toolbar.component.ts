import {Component, HostListener, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';

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
    @Input() catchBackButton = true;
    @Input() showLogoutButton = false;

    // eslint-disable-next-line @typescript-eslint/member-ordering
    constructor(private navigation: NavigationService, private dialog: MatDialog, private authService: AuthService) {
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.navigation.back();
        }
    }

    @HostListener('window:popstate', ['$event']) onBrowserBackBtnClose(event: Event): void {
        console.log('Back clicked');
        event.preventDefault();

        if (this.catchBackButton) {

            this.navigation.backEvent();
            this.backClicked();
        } else {
            console.warn('Preventing default back event');
        }
    }

    ngOnInit(): void {
    }

    backClicked(): void {
        if (this.beforeBackFunction != null) {
            this.beforeBackFunction(() => {
                this.navigation.back();
            });
        } else {
            this.navigation.back();
        }
    }

    homeClicked(): void {
        this.navigation.home();
    }

    buttonClicked(button: CustomButton): void {
        button.navigate();
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

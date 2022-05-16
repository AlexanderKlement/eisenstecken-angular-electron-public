import {Component, HostListener, Input, OnInit} from '@angular/core';
import {NavigationService} from '../../services/navigation.service';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from '../../services/auth.service';
import {Location, PlatformLocation} from '@angular/common';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';

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
    @Input() navigateBackOnPopstate = true;
    @Input() showLogoutButton = false;

    ignorePopState = true;


    constructor(private navigation: NavigationService, private dialog: MatDialog,
                private authService: AuthService, private router: Router) {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    console.log('Detected Popstate event');
                    if (this.ignorePopState) {
                        this.ignorePopState = false;
                        console.log('Popstate ignored');
                        const currentRoute = this.router.routerState;
                        this.navigation.dontAddNextRouteToHistory();
                        this.router.navigateByUrl(currentRoute.snapshot.url, {
                            skipLocationChange: true,
                            replaceUrl: true
                        }).then(() => {
                            if (this.navigateBackOnPopstate) {
                                this.backClicked();
                            }
                        });
                    }
                }
            }
        });
    }


    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.navigation.back();
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

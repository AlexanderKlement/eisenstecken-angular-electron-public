import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {InfoDialogComponent} from './info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    private static debugCode = 'DEBUG';
    private static debugTimeoutLengthSeconds = 10;

    private debugTimer: NodeJS.Timeout;
    private keyBoardEntries = '';

    constructor(private authService: AuthService, private dialog: MatDialog, private router: Router) {
    }

    @HostListener('document:keypress', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        this.keyBoardEntries += event.key.toUpperCase();
    }


    ngOnInit(): void {
    }

    ngOnDestroy() {
        clearInterval(this.debugTimer);
    }

    showInfoClicked(): void {
        this.dialog.open(InfoDialogComponent, {
            width: (window.innerWidth - 100).toString() + 'px',
            data: {}
        });
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

    onLogoDoubleClick() {
        this.keyBoardEntries = '';
        this.debugTimer = setTimeout(
            () => {
                this.checkCode();
            }, HomeComponent.debugTimeoutLengthSeconds * 1000
        );
    }

    private checkCode(): void {
        if (this.keyBoardEntries.indexOf(HomeComponent.debugCode) >= 0) {
            this.router.navigateByUrl('debug');
        }
    }
}


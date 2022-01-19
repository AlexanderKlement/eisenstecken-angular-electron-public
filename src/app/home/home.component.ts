import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {InfoDialogComponent} from './info-dialog/info-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';

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
        this.authService.doLogout();
    }

    onLogoDoubleClick() {
        this.keyBoardEntries = '';
        this.debugTimer = setInterval(
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


import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../components/confirm-dialog/confirm-dialog.component';
import {first} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class EmailService {

    mailArray: string[] = [];


    constructor(private electronService: ElectronService, private dialog: MatDialog) {
        this.initMailResponse();
    }

    sendMail(mail: string, subject: string, body: string, attachment?: string): Promise<void> {
        if (!this.electronService.isElectron) {
            console.warn('Not electron: got the following though:');
            console.warn(mail);
            console.warn(subject);
            console.warn(body);
            console.warn(attachment);
            return new Promise((resolve, reject) => {
                reject();
            });
        }

        this.mailArray = [];
        this.mailArray.push(mail);
        this.mailArray.push(subject);
        this.mailArray.push(this.decodeHtml(body));

        if (attachment) {
            this.mailArray.push(attachment);
        }

        return new Promise<void>((resolve, reject) => {
            try {
                this.electronService.ipcRenderer.send('send-mail-request', this.mailArray);
            } catch (e) {
                console.warn(e);
                console.warn('Cannot send request to api');
                reject();
            }
        });
    }

    decodeHtml(html) {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    }

    setMailPorcessor64(): void {
        this.setMailProcessor('x64');
    }

    setMailProcessor86(): void {
        this.setMailProcessor('x86');
    }

    private setMailProcessor(proc: string): Promise<void> {
        if (!this.electronService.isElectron) {
            console.warn('Not electron: got the following though:');
            return new Promise((resolve, reject) => {
                reject();
            });
        }
        return new Promise<void>((resolve, reject) => {
            try {
                this.electronService.ipcRenderer.on('set-mail-processor-reply', (_, data) => {
                    if (data) {
                        resolve();
                    } else {
                        reject();
                    }
                });
                this.electronService.ipcRenderer.send('set-mail-processor-request', [proc]);
            } catch (e) {
                console.warn(e);
                console.warn('Cannot send request to api');
                reject();
            }
        });
    }

    private initMailResponse() {
        if (this.electronService.isElectron) {
            this.electronService.ipcRenderer.on('send-mail-reply', (_, data) => {
                if (data !== true) {
                    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
                        width: '400px',
                        data: {
                            title: 'Email konnte nicht gesendet werden.',
                            text: data + 'Erneut versuchen?'
                        }
                    });
                    dialogRef.afterClosed().subscribe(result => {
                        if (result) {
                            this.electronService.ipcRenderer.send('send-mail-request', this.mailArray);
                        }
                    });
                }
            });
        }

    }
}



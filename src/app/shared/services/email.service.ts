import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';

@Injectable({
    providedIn: 'root'
})
export class EmailService {


    constructor(private electronService: ElectronService) {
    }

    sendMail(mail: string, subject: string, body: string, attachment?: string): Promise<void> {
        if (!this.electronService.isElectron) {
            console.warn('Not electron: got the following though:');
            console.log(mail);
            console.log(subject);
            console.log(body);
            console.log(attachment);
            return new Promise((resolve, reject) => {
                reject();
            });
        }

        console.log(body);


        // TODO: implement some checks here

        const mailArray = [];
        mailArray.push(mail);
        mailArray.push(subject);
        mailArray.push(this.decodeHtml(body));

        if (attachment) {
            mailArray.push(attachment);
        }

        return new Promise<void>((resolve, reject) => {
            try {
                this.electronService.ipcRenderer.on('send-mail-reply', (_, data) => {
                    if (data) {
                        resolve();
                    } else {
                        reject();
                    }
                });
                this.electronService.ipcRenderer.send('send-mail-request', mailArray);
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

}



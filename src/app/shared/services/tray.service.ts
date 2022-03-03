import {Injectable} from '@angular/core';
import {ElectronService} from '../../core/services';

@Injectable({
    providedIn: 'root'
})
export class TrayService {

    constructor(private electronService: ElectronService) {
    }

    showBalloon(title: string, content: string): Promise<boolean> {
        if (!this.electronService.isElectron) {
            console.error('Opening Files is only possible in electron!');
            console.error(title);
            console.error(content);
            return new Promise((resolve, reject) => {
                reject();
            });
        }
        return new Promise<boolean>((resolve, reject) => {
            const balloonArray = [];
            balloonArray.push(title);
            balloonArray.push(content);
            try {
                this.electronService.ipcRenderer.on('show-tray-balloon-replay', (_, data) => {
                    if (data) {
                        resolve(data);
                    } else {
                        reject();
                    }
                });
                this.electronService.ipcRenderer.send('show-tray-balloon-request', balloonArray);
            } catch (e) {
                console.error(e);
                console.error('Cannot send request to api');
                reject();
            }
        });
    }
}

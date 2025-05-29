import { Component } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { APP_CONFIG } from '../environments/environment';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('de');
    console.info('APP_CONFIG', APP_CONFIG);

    if (electronService.isElectron) {
      console.info(process.env);
      console.info('Run in electron');
      console.info('NodeJS childProcess', this.electronService.childProcess);
    } else {
      console.info('Run in browser');
    }
  }
}

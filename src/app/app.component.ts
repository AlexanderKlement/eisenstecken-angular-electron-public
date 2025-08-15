import {Component} from "@angular/core";
import {ElectronService} from "./core/services";
import {TranslateService} from "@ngx-translate/core";
import {APP_CONFIG} from "../environments/environment";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(
        private electronService: ElectronService,
        private translate: TranslateService
    ) {
        this.translate.setDefaultLang("de");
      // eslint-disable-next-line no-console
        console.info("APP_CONFIG", APP_CONFIG);

        if (electronService.isElectron) {
          // eslint-disable-next-line no-console
            console.info(process.env);
          // eslint-disable-next-line no-console
            console.info("Run in electron");
          // eslint-disable-next-line no-console
            console.info("NodeJS childProcess", this.electronService.childProcess);
        } else {
          // eslint-disable-next-line no-console
            console.info("Run in browser");
        }
    }
}

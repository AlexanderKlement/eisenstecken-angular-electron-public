import { Component, HostListener } from "@angular/core";
import { Location } from "@angular/common";
import { ElectronService } from "./core/services";
import { TranslateService } from "@ngx-translate/core";
import { APP_CONFIG } from "../environments/environment";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private electronService: ElectronService,
    private translate: TranslateService,
    private location: Location,
    private dialog: MatDialog,
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

  @HostListener('window:keydown', ['$event'])
  onKeydown(e: KeyboardEvent) {
    if (e.code !== "Escape") return;

    // check if user is typing
    const ae = document.activeElement as HTMLElement | null;
    const typing =
      ae &&
      (ae.tagName === "INPUT" ||
        ae.tagName === "TEXTAREA" ||
        ae.isContentEditable);

    if (typing) return;

    // if any dialogs are open, close the topmost one instead of navigating
    const openDialogs = this.dialog.openDialogs;
    if (openDialogs.length > 0) {
      const top = openDialogs[openDialogs.length - 1];
      top.close();
      return;
    }

    // otherwise, navigate back (guard will handle unsaved changes)
    this.location.back();
  }
}

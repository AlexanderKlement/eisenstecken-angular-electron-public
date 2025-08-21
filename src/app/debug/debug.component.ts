import {Component, OnInit} from "@angular/core";
import {UntypedFormControl, UntypedFormGroup} from "@angular/forms";
import {EmailService} from "../shared/services/email.service";
import {FileService} from "../shared/services/file.service";
import {TrayService} from "../shared/services/tray.service";
import {Router} from "@angular/router";
import {ipcRenderer} from "electron";
import {ElectronService} from "../core/services";

@Component({
    selector: 'app-debug',
    templateUrl: './debug.component.html',
    styleUrls: ['./debug.component.scss'],
    standalone: false
})
export class DebugComponent implements OnInit {
  emailFormGroup: UntypedFormGroup;
  openFileFormGroup: UntypedFormGroup;
  showFileFormGroup: UntypedFormGroup;
  selectFolderFormGroup: UntypedFormGroup;
  trayBalloonFormGroup: UntypedFormGroup;

  constructor(private email: EmailService, private file: FileService, private tray: TrayService, private electronService: ElectronService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.initEmailGroup();
    this.initOpenFileGroup();
    this.initShowFileGroup();
    this.initSelectFolderGroup();
    this.initTrayBalloonFromGroup();
  }

  onEmailSubmit(): void {
    if (this.emailFormGroup.get("attachment").value.length > 1) {
      this.email.sendMail(
        this.emailFormGroup.get("email").value,
        this.emailFormGroup.get("subject").value,
        this.emailFormGroup.get("body").value,
        this.emailFormGroup.get("attachment").value,
      );
    } else {
      this.email.sendMail(
        this.emailFormGroup.get("email").value,
        this.emailFormGroup.get("subject").value,
        this.emailFormGroup.get("body").value,
      );
    }
  }

  openFileSubmit() {
    this.file.open(this.openFileFormGroup.get("path").value).then((response) => {
      this.openFileFormGroup.get("response").setValue(response);
    });
  }

  showFileSubmit() {
    this.file.show(this.showFileFormGroup.get("path").value);
  }

  trayBalloonSubmit() {
    this.tray.showBalloon(this.trayBalloonFormGroup.get("title").value,
      this.trayBalloonFormGroup.get("content").value);
  }

  selectFolderClicked() {
    this.file.selectFolder().then((result) => {
      this.selectFolderFormGroup.get("path").setValue(result);
    });
  }

  mobileClicked(): void {
    this.router.navigateByUrl("mobile");
  }

  simulateUpdateClicked() {
    if (!this.electronService.isElectron) {
      this.electronService.ipcRenderer.send("restart_app");
    }
  }

  private initEmailGroup() {
    this.emailFormGroup = new UntypedFormGroup({
      email: new UntypedFormControl(""),
      subject: new UntypedFormControl(""),
      body: new UntypedFormControl(""),
      attachment: new UntypedFormControl("")
    });
  }

  private initOpenFileGroup() {
    this.openFileFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl(""),
      response: new UntypedFormControl("")
    });
  }

  private initShowFileGroup() {
    this.showFileFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl("")
    });
  }

  private initSelectFolderGroup() {
    this.selectFolderFormGroup = new UntypedFormGroup({
      path: new UntypedFormControl(""),
    });
  }

  private initTrayBalloonFromGroup() {
    this.trayBalloonFormGroup = new UntypedFormGroup({
      title: new UntypedFormControl(""),
      content: new UntypedFormControl(""),
    });
  }


}

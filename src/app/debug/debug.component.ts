import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {EmailService} from '../shared/services/email.service';
import {FileService} from '../shared/services/file.service';
import {TrayService} from '../shared/services/tray.service';
import {Router} from '@angular/router';
import {ipcRenderer} from 'electron';
import {ElectronService} from '../core/services';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {
  emailFormGroup: FormGroup;
  openFileFormGroup: FormGroup;
  showFileFormGroup: FormGroup;
  selectFolderFormGroup: FormGroup;
  trayBalloonFormGroup: FormGroup;

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
    if (this.emailFormGroup.get('attachment').value.length > 1) {
      this.email.sendMail(
        this.emailFormGroup.get('email').value,
        this.emailFormGroup.get('subject').value,
        this.emailFormGroup.get('body').value,
        this.emailFormGroup.get('attachment').value,
      );
    } else {
      this.email.sendMail(
        this.emailFormGroup.get('email').value,
        this.emailFormGroup.get('subject').value,
        this.emailFormGroup.get('body').value,
      );
    }
  }

  openFileSubmit() {
    this.file.open(this.openFileFormGroup.get('path').value).then((response) => {
      this.openFileFormGroup.get('response').setValue(response);
    });
  }

  showFileSubmit() {
    this.file.show(this.showFileFormGroup.get('path').value);
  }

  trayBalloonSubmit() {
    this.tray.showBalloon(this.trayBalloonFormGroup.get('title').value,
      this.trayBalloonFormGroup.get('content').value);
  }

  selectFolderClicked() {
    this.file.selectFolder().then((result) => {
      this.selectFolderFormGroup.get('path').setValue(result);
    });
  }

  mobileClicked(): void {
    this.router.navigateByUrl('mobile');
  }

  simulateUpdateClicked() {
    if (!this.electronService.isElectron) {
      this.electronService.ipcRenderer.send('restart_app');
    }
  }

  private initEmailGroup() {
    this.emailFormGroup = new FormGroup({
      email: new FormControl(''),
      subject: new FormControl(''),
      body: new FormControl(''),
      attachment: new FormControl('')
    });
  }

  private initOpenFileGroup() {
    this.openFileFormGroup = new FormGroup({
      path: new FormControl(''),
      response: new FormControl('')
    });
  }

  private initShowFileGroup() {
    this.showFileFormGroup = new FormGroup({
      path: new FormControl('')
    });
  }

  private initSelectFolderGroup() {
    this.selectFolderFormGroup = new FormGroup({
      path: new FormControl(''),
    });
  }

  private initTrayBalloonFromGroup() {
    this.trayBalloonFormGroup = new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
    });
  }


}

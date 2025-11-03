import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AbstractControl } from '@angular/forms';
import { Subscription, firstValueFrom } from 'rxjs';
import { first } from "rxjs/operators";
import { BackStackService } from '../../../src/app/shared/services/back-stack.service';

export interface CustomButton {
  name: string;
  navigate: VoidFunction;
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: false,
})
export class ToolbarComponent implements OnInit {

  @Input() buttonList?: CustomButton[];
  @Input() beforeBackFunction?: (afterBackFunction: VoidFunction) => void;
  @Input() title = '';
  @Input() showBackButton = true;
  @Input() showLogoutButton = false;
  @Input() controlsBeforeBack: AbstractControl[] = [];

  private subscription: Subscription;
  private atLeastOneFormModified = false;
  private disposeBackHandler?: () => void;

  // eslint-disable-next-line @typescript-eslint/member-ordering,max-len
  constructor(private navigation: NavigationService, private dialog: MatDialog, private authService: AuthService, private backStack: BackStackService) {
  }

  private async openDiscardDialog(): Promise<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { title: 'Änderungen verwerfen?', text: 'Mindestens ein Eingabefeld wurde bearbeitet.' },
    });
    const result = await firstValueFrom(ref.afterClosed().pipe(first()));
    return !!result;
  }


  ngOnInit(): void {
    this.subscription = new Subscription();
    for (const outerControl of this.controlsBeforeBack) {
      this.subscription.add(outerControl.valueChanges.subscribe((value) => {
        for (const innerControl of this.controlsBeforeBack) {
          if (innerControl.dirty) {
            this.formDirty();
            break;
          }
        }
      }));
    }
  }

  formDirty(): void {
    this.subscription.unsubscribe();
    this.atLeastOneFormModified = true;
    if (!this.disposeBackHandler) {
      this.disposeBackHandler = this.backStack.push(() => {
        // Confirm; if confirmed, do a back and consume the event.
        this.openDiscardDialog().then((confirmed) => {
          if (confirmed) this.navigation.back();
        });
        return true; // consume back/ESC
      });
    }
  }

  homeClicked(): void {
    if (this.atLeastOneFormModified) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Änderungen verwerfen?',
          text: 'Mindestens ein Eingabefeld wurde bearbeitet.',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.navigation.home();
        } else {
          console.log('Hier könnte ihr popstate stehen');
        }
      });
    } else {
      this.navigation.home();
    }
  }

  buttonClicked(button: CustomButton): void {
    button.navigate();
  }

  backButtonClicked(): void {
    if (this.atLeastOneFormModified) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Änderungen verwerfen?',
          text: 'Mindestens ein Eingabefeld wurde bearbeitet.',
        },
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.navigation.back();
        } else {
          console.log('Hier könnte ihr popstate stehen');
        }
      });
    } else {
      this.navigation.back();
    }
  }

  logoutClicked(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Abmelden?',
        text: 'Soll der Benutzer abgemeldet werden?',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.doLogout();
      }
    });
  }

}

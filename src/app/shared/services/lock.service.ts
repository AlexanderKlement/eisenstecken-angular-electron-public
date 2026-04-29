import { Injectable, inject } from "@angular/core";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {first} from "rxjs/operators";
import {LockDialogComponent} from "../components/info-builder/lock-dialog/lock-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import { DefaultService, Lock } from "../../../api/openapi";

@Injectable({
    providedIn: 'root'
})
export class LockService {
    private api = inject(DefaultService);
    private router = inject(Router);
    dialog = inject(MatDialog);


    getLockAndTryNavigate(lock$: Observable<Lock>, lockObservable: Observable<boolean>,
                          unlockObservable: Observable<boolean>, navigationTarget: string): void {
        lock$.pipe(first()).subscribe((lock) => {
            if (lock.locked) {
                this.api.readUsersMeUsersMeGet().pipe(first()).subscribe((user) => {
                    if (user.id === lock.user.id) {
                        this.lockAndNavigate(lockObservable, navigationTarget);
                    } else {
                        this.showLockDialog(lock, unlockObservable);
                    }
                });
            } else {
                this.lockAndNavigate(lockObservable, navigationTarget);
            }
        });
    }

  private lockAndNavigate(lockRequest$: Observable<any>, navigationTarget: string): void {
      // we can make this an Observable<void> to ensure that the navigation only occurs when the lock is successfully acquired
    lockRequest$.pipe(first()).subscribe({
      next: () => {
        this.router.navigateByUrl(navigationTarget);
      },
      error: (err) => {
        console.error("LockService: Unable to lock desired resource", err);
      }
    });
  }

    private showLockDialog(lock: Lock, unlockObservable: Observable<boolean>): void {
        this.dialog.open(LockDialogComponent, {
            data: {
                lock,
                unlockObservable
            }
        });
    }
}

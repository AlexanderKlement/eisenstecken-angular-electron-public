import { OnDestroy } from '@angular/core';
import { MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { BackStackService } from '../../../src/app/shared/services/back-stack.service';

export abstract class BaseDialogComponent<T = any> implements OnDestroy {
  private dispose?: () => void;

  protected constructor(
    protected readonly dialogRef: MatDialogRef<T>,
    backStack: BackStackService,
  ) {
    // Register a handler: if back is pressed while open, close the dialog
    this.dispose = backStack.push(() => {
      if (this.dialogRef.getState() === MatDialogState.OPEN) {
        this.dialogRef.close('back');
        return true; // consumed
      }
      return false; // not open; let navigation proceed
    });

    // Clean up when the dialog closes
    this.dialogRef.afterClosed().subscribe(() => this.ngOnDestroy());
  }

  ngOnDestroy(): void {
    this.dispose?.();
    this.dispose = undefined;
  }
}

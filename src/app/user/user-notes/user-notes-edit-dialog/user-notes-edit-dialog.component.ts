import { Component, OnInit, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions
} from "@angular/material/dialog";
import {
  UntypedFormControl,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from "@angular/forms";
import { first } from "rxjs/operators";
import { ConfirmDialogComponent } from "../../../shared/components/confirm-dialog/confirm-dialog.component";
import { AuthStateService } from "../../../shared/services/auth-state.service";
import {
  DefaultService,
  ScopeEnum,
  UserNoteCreate,
  UserNoteUpdate
} from "../../../../api/openapi";
import { CdkScrollable } from "@angular/cdk/scrolling";
import { DefaultLayoutDirective, DefaultLayoutAlignDirective } from "ng-flex-layout";
import { MatFormField, MatLabel, MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

export interface UserNoteEditDialogData {
  id: number;
}


@Component({
  selector: "app-user-notes-edit-dialog",
  templateUrl: "./user-notes-edit-dialog.component.html",
  styleUrls: ["./user-notes-edit-dialog.component.scss"],
  imports: [MatDialogTitle, MatDialogContent, FormsModule, ReactiveFormsModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, MatFormField, MatLabel, MatInput, MatDialogActions, MatButton]
})
export class UserNotesEditDialogComponent implements OnInit {
  dialogRef = inject<MatDialogRef<UserNoteEditDialogData>>(MatDialogRef);
  dialog = inject(MatDialog);
  private authService = inject(AuthStateService);
  data = inject<UserNoteEditDialogData>(MAT_DIALOG_DATA);
  private api = inject(DefaultService);

  title: string;
  createMode = true;
  userNoteGroup: FormGroup<{
    name: FormControl<string>,
    body: FormControl<string>
  }>;
  showDeleteButton = false;
  id: number;


  ngOnInit(): void {
    this.id = this.data.id;
    this.createMode = this.id < 1;
    this.userNoteGroup = new FormGroup({
      name: new FormControl(""),
      body: new FormControl("")
    });
    if (!this.createMode) {
      this.api.readUserNoteUserNoteUserNoteIdGet(this.id).pipe(first()).subscribe((userNote) => {
        this.userNoteGroup.get("name").setValue(userNote.name);
        this.userNoteGroup.get("body").setValue(userNote.body);
      });

    }
    this.authService.currentUserHasScope(ScopeEnum.Office).pipe(first()).subscribe((access) => {
      if (access && !this.createMode) {
        this.showDeleteButton = true;
      }
    });

  }

  onCancelClick() {
    this.dialogRef.close();
  }

  onSaveClick() {
    if (this.createMode) {
      const userNoteCreate: UserNoteCreate = {
        body: this.userNoteGroup.get("body").value,
        name: this.userNoteGroup.get("name").value
      };
      this.api.createUserNoteUserNotePost(userNoteCreate).pipe(first()).subscribe((userNote) => {
        this.id = userNote.id;
        this.dialogRef.close();
      });
    } else {
      const userNoteUpdate: UserNoteUpdate = {
        body: this.userNoteGroup.get("body").value,
        name: this.userNoteGroup.get("name").value
      };
      this.api.updateUserNoteUserNoteUserNoteIdPut(this.id, userNoteUpdate).pipe(first()).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }

  onDeleteClick() {
    const confirmDialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: "400px",
      data: {
        title: "Notiz löschen?",
        text: "Dieser Schritt kann nicht rückgängig gemacht werden."
      }
    });
    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.deleteUserUsersUserIdDelete(this.id).pipe(first()).subscribe(() => {
          this.dialogRef.close();
        });
      }
    });

  }
}

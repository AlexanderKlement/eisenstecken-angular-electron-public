import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, first, tap } from "rxjs/operators";
import { DefaultService, Note, NoteCreate } from "../../../../api/openapi";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-single-note",
  templateUrl: "./single-note.component.html",
  styleUrls: ["./single-note.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, MatIcon]
})
export class SingleNoteComponent implements OnInit, OnDestroy {
  private api = inject(DefaultService);


  @Input() note: Note;
  @Output() noteDeleted = new EventEmitter<Note>();
  noteVisible = true;
  saved: number = 0;
  public subscriptions = new Subscription();

  singleNoteTextArea = new UntypedFormControl();

  ngOnInit(): void {
    this.singleNoteTextArea.setValue(this.note.text);

    this.subscriptions.add(this.singleNoteTextArea.valueChanges
      .pipe(
        tap(() => {
          this.saved = 1;
        }),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(data => {
        const noteCreate: NoteCreate = { text: data };
        this.api.updateNoteEntryNoteNoteIdPut(this.note.id, noteCreate).pipe(first()).subscribe(() => {
          this.saved = 2;
          setTimeout(() => {
            this.saved = 0;
          }, 10000);
        });
      }));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  deleteNoteClicked(): void {
    this.api.deleteNoteEntryNoteNoteIdDelete(this.note.id).pipe(first()).subscribe(() => {
      this.noteVisible = false;
      this.noteDeleted.emit(this.note);
    });
  }
}


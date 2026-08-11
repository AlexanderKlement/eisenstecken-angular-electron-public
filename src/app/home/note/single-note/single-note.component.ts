import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, first, tap } from "rxjs/operators";
import { DefaultService, Note, NoteUpdate } from "../../../../api/openapi";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "app-single-note",
  templateUrl: "./single-note.component.html",
  styleUrls: ["./single-note.component.scss"],
  imports: [FormsModule, ReactiveFormsModule, MatIcon]
})
export class SingleNoteComponent implements OnInit, OnDestroy, AfterViewInit {
  private api = inject(DefaultService);
  @ViewChild("container") container: ElementRef<HTMLDivElement>;

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
        const noteCreate: NoteUpdate = { text: data, height: null };
        this.api.updateNoteEntryNoteNoteIdPut(this.note.id, noteCreate).pipe(first()).subscribe(() => {
          this.saved = 2;
          setTimeout(() => {
            this.saved = 0;
          }, 10000);
        });
      }));
  }

  ngAfterViewInit() {
    if (this.note.height) {
      this.container.nativeElement.attributeStyleMap.set("height", `${this.note.height}px`);
    }
    document.addEventListener("mousemove", this.mouseMove.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));
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

  private mousedownCoords: { y: number, curHeight: number } | null = null;
  private height: number | null = null;

  protected mouseMove(event: MouseEvent): void {
    if (this.mousedownCoords) {
      const movement = event.clientY - this.mousedownCoords.y;
      const newHeight = this.mousedownCoords.curHeight + movement;
      this.container.nativeElement.attributeStyleMap.set("height", `${newHeight}px`);
      this.height = newHeight;
    }
  }

  protected mouseUp(): void {
    if (this.mousedownCoords) {
      this.mousedownCoords = null;
      if (this.height) {
        const noteCreate: NoteUpdate = { text: this.singleNoteTextArea.value, height: this.height };
        this.saved = 1;
        setTimeout(() => {
          this.api.updateNoteEntryNoteNoteIdPut(this.note.id, noteCreate).pipe(first()).subscribe(() => {
            this.saved = 2;
            this.height = null;
            setTimeout(() => {
              this.saved = 0;
            }, 10000);
          });
        }, 200);
      }
    }
  }

  protected mouseDown(event: MouseEvent): void {
    event.stopPropagation();
    this.mousedownCoords = { curHeight: this.container.nativeElement.clientHeight, y: event.clientY };
  }
}


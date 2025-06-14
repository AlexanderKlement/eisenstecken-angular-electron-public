import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { DefaultService, Note, NoteCreate } from '../../../client/api';
import { SingleNoteComponent } from './single-note/single-note.component';
import { MatIcon } from '@angular/material/icon';
import { MatFabButton } from '@angular/material/button';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  imports: [SingleNoteComponent, MatIcon, MatFabButton, NgIf, NgForOf],
})
export class NoteComponent implements OnInit {
  @ViewChild('noteBox') noteBox: ElementRef;

  notes: Note[] = [];
  maxNotes = 2;

  constructor(private api: DefaultService) {}

  ngOnInit(): void {
    this.api
      .readNoteEntriesNoteGet()
      .pipe(first())
      .subscribe(notes => {
        this.notes = notes;
        if (this.notes.length === 0) {
          this.newNoteClicked();
        }
      });
  }

  public newNoteClicked(): void {
    const noteCreate: NoteCreate = { text: '' };
    const newNoteObservable = this.api.createNoteEntryNotePost(noteCreate);
    newNoteObservable.pipe(first()).subscribe(note => {
      this.notes.push(note);
    });
  }

  public addNoteAvailable(): boolean {
    return this.notes.length < this.maxNotes;
  }

  deleteNote(note: Note) {
    this.notes.forEach((element, index) => {
      if (element.id === note.id) {
        this.notes.splice(index, 1);
      }
    });
  }
}

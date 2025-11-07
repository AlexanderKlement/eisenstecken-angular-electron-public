import {Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {first} from "rxjs/operators";
import { DefaultService, Note, NoteCreate } from "../../../api/openapi";
import { FlexModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective } from "ng-flex-layout";
import { SingleNoteComponent } from "./single-note/single-note.component";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";

@Component({
    selector: 'app-note',
    templateUrl: './note.component.html',
    styleUrls: ['./note.component.scss'],
    imports: [FlexModule, DefaultLayoutDirective, DefaultLayoutAlignDirective, DefaultFlexDirective, SingleNoteComponent, MatFabButton, MatIcon]
})
export class NoteComponent implements OnInit {

    @ViewChild("noteBox") noteBox: ElementRef;

    notes: Note[] = [];
    maxNotes = 2;

    constructor(private api: DefaultService) {

    }

    ngOnInit(): void {
        this.api.readNoteEntriesNoteGet().pipe(first()).subscribe((notes) => {
            this.notes = notes;
            if (this.notes.length === 0) {
                this.newNoteClicked();
            }
        });
    }

    public newNoteClicked(): void {
        const noteCreate: NoteCreate = {text: ""};
        const newNoteObservable = this.api.createNoteEntryNotePost(noteCreate);
        newNoteObservable.pipe(first()).subscribe((note) => {
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


import { booleanAttribute, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { OfferLibrary, OfferLibraryEntry } from "../../../api/openapi";
import { MatFormField, MatLabel } from "@angular/material/input";
import { formatCurrency } from "@angular/common";
import { MtxSelect } from "@ng-matero/extensions/select";
import { DefaultFlexDirective } from "ng-flex-layout";

export declare type LibraryEntryDropDownItem = {
  id: number;
  name: string;
  label: string;
  library: string;
  price: number;
}

export function libraryEntryToString(entry: OfferLibraryEntry): string {
  return `${entry.name} ${formatCurrency(entry.price, "de-DE", "€").replace(" ", "")}${entry.unit ? "/" : ""}${entry.unit?.short}`;
}

function mapToDropDownItems(library: OfferLibrary): LibraryEntryDropDownItem[] {
  return library.entries.map((entry) => {
    return {
      id: entry.id,
      label: libraryEntryToString(entry),
      name: entry.name,
      price: entry.price,
      library: library.name
    };
  });
}

@Component({
  selector: "app-offer-library-entry-selector",
  templateUrl: "./offer-library-entry-selector.component.html",
  styleUrls: ["./offer-library-entry-selector.component.scss"],
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MtxSelect,
    DefaultFlexDirective
  ]
})
export default class OfferLibraryEntrySelectorComponent implements OnInit {

  @Input() allLibraries: OfferLibrary[];
  @Input() firstLibraryId?: number;
  @Input() value?: number;
  @Input() label: string;
  @Input({ transform: booleanAttribute }) outline: boolean;
  @Input({ transform: booleanAttribute }) readonly: boolean;
  @Input({ transform: booleanAttribute }) fillWidth: boolean;
  @Output() setValue: EventEmitter<LibraryEntryDropDownItem> = new EventEmitter();

  @Output() keyClicked: EventEmitter<KeyboardEvent> = new EventEmitter();

  items: LibraryEntryDropDownItem[] = [];


  ngOnInit() {
    const foundLibrary = this.allLibraries.find(lib => lib.id === this.firstLibraryId);
    const allLibrariesMapped = this.allLibraries.filter(lib => lib.id !== this.firstLibraryId).map(mapToDropDownItems);
    this.items = (foundLibrary ? mapToDropDownItems(foundLibrary) : []).concat(...allLibrariesMapped);
  }


  onChange(event: LibraryEntryDropDownItem) {
    this.setValue.emit(event);
  }

  protected onKeyUp(event: KeyboardEvent) {
    this.keyClicked.emit(event);
  }
}

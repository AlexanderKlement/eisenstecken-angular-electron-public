import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";

interface KommissionBeispiel {
  eingabe: string;
  auftrag: string;
  position: string | null;
}

@Component({
  selector: "app-commission-help-drawer",
  standalone: true,
  templateUrl: "./commission-help-drawer.component.html",
  styleUrls: ["./commission-help-drawer.component.scss"]
})
export class CommissionHelpDrawerComponent implements OnChanges {
  /** Steuert, ob der Drawer offen ist. */
  @Input() open = false;

  /** Wird ausgelöst, wenn der Drawer geschlossen werden soll (X, Scrim, Esc). */
  @Output() closed = new EventEmitter<void>();

  @ViewChild("closeButton") private closeButton?: ElementRef<HTMLButtonElement>;

  /** Element, das vor dem Öffnen den Fokus hatte (z. B. der „So funktioniert’s“-Button). */
  private previouslyFocused: HTMLElement | null = null;

  readonly beispiele: KommissionBeispiel[] = [
    { eingabe: "2026 047/1 B12", auftrag: "2026047/1", position: "B12" },
    { eingabe: "2026047/1 B12", auftrag: "2026047/1", position: "B12" },
    { eingabe: "2026 047 B12", auftrag: "2026047", position: "B12" },
    { eingabe: "2026047 B12", auftrag: "2026047", position: "B12" },
    { eingabe: "2026047/10 B12", auftrag: "2026047/10", position: "B12" },
    { eingabe: "2026047", auftrag: "2026047", position: null },
    { eingabe: "Lager", auftrag: "Lager", position: null }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["open"]) return;

    if (this.open) {
      this.previouslyFocused = document.activeElement as HTMLElement | null;
      // Nach dem Rendern auf den Schließen-Button fokussieren
      setTimeout(() => this.closeButton?.nativeElement.focus());
    } else if (this.previouslyFocused) {
      this.previouslyFocused.focus();
      this.previouslyFocused = null;
    }
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    if (this.open) this.close();
  }

  close(): void {
    this.closed.emit();
  }
}

import { booleanAttribute, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import { DefaultFlexDirective } from "ng-flex-layout";
import { CdkDragHandle, CdkDragPlaceholder } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-list-element",
  imports: [
    MatIcon,
    DefaultFlexDirective,
    CdkDragHandle,
    CdkDragPlaceholder
  ],
  templateUrl: "./list-element.component.html",
  styleUrl: "./list-element.component.scss"
})
export class ListElementComponent {
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;
  @Input() mainText: string;
  @Input() subText?: string;
  @Input({ transform: booleanAttribute }) dottedAccent?: boolean;
  @Input({ transform: booleanAttribute }) centered?: boolean;
  @Input({ transform: booleanAttribute }) pointer?: boolean;
  @Input({ transform: booleanAttribute }) pointerRightIcon?: boolean;
  @Input({ transform: booleanAttribute }) isDraggable?: boolean;
  @Output() clicked = new EventEmitter<void>();
  @Output() clickedRightIcon = new EventEmitter<void>();

  onDragStart(event: DragEvent) {
    if (this.isDraggable) {
      console.log(event);
    }
  }

  onDragOver(event: DragEvent) {
    if (this.isDraggable) {
      console.log(event);
    }
  }

  onDragEnd(event: DragEvent) {
    if (this.isDraggable) {
      console.log(event);
    }
  }
}

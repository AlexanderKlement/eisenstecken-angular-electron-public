import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: "app-circle-icon-button",
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: "./circle-icon-button.component.html",
  styleUrl: "./circle-icon-button.component.scss",
})
export class CircleIconButtonComponent {
  @Input() icon?: string;
  @Input() svgIcon?: string;
  @Input() backgroundColor = "#fff";
  @Input() size = 40;
  @Input() disabled = false;
  @Input() click: () => void;
  @Input() ariaLabel?: string;
}

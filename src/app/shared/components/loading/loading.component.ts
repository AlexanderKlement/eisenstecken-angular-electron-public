import { Component, Input } from "@angular/core";
import { FlexModule } from "ng-flex-layout";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  imports: [FlexModule, MatProgressSpinner]
})
export class LoadingComponent {

  @Input() loading: boolean;

  constructor() {
  }

}

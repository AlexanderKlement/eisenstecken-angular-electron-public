import { Component, OnInit } from "@angular/core";
import { AuthService } from "../shared/services/auth.service";
import { InfoDialogComponent } from "./info-dialog/info-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DefaultService } from "../../api/openapi";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  DefaultFlexDirective,
  FlexModule,
} from "ng-flex-layout";
import { CalendarsChatFrameComponent } from "./calendars-chat-frame/calendars-chat-frame.component";
import { NoteComponent } from "./note/note.component";
import { MenuTilesComponent } from "./menu-tiles/menu-tiles.component";
import { CircleIconButtonComponent } from "../shared/components/circle-icon-button/circle-icon-button.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexDirective,
    FlexModule,
    CalendarsChatFrameComponent,
    NoteComponent,
    MenuTilesComponent,
    CircleIconButtonComponent,
  ],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private api: DefaultService,
  ) {
  }

  ngOnInit(): void {
    this.api.readUsersMeUsersMeGet().subscribe((user) => {
      console.log(user);
    });
  }

  showInfoClicked(): void {
    this.dialog.open(InfoDialogComponent, {
      width: (window.innerWidth - 100).toString() + "px",
      data: {},
    });
  }
}

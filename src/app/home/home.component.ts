import { Component, OnInit } from "@angular/core";
import { AuthStateService } from "../shared/services/auth-state.service";
import { InfoDialogComponent } from "./info-dialog/info-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { DefaultService, ScopeEnum } from "../../api/openapi";
import {
  DefaultLayoutDirective,
  DefaultLayoutAlignDirective,
  DefaultFlexDirective,
  FlexModule
} from "ng-flex-layout";
import { CalendarsChatFrameComponent } from "./calendars-chat-frame/calendars-chat-frame.component";
import { NoteComponent } from "./note/note.component";
import { MenuTilesComponent } from "./menu-tiles/menu-tiles.component";
import { CircleIconButtonComponent } from "../shared/components/circle-icon-button/circle-icon-button.component";
import { NgOptimizedImage } from "@angular/common";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  imports: [
    DefaultLayoutDirective,
    DefaultLayoutAlignDirective,
    DefaultFlexDirective,
    FlexModule,
    CalendarsChatFrameComponent,
    NoteComponent,
    MenuTilesComponent,
    CircleIconButtonComponent,
    NgOptimizedImage
  ]
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthStateService,
    private dialog: MatDialog,
    private api: DefaultService
  ) {
  }

  userScope: ScopeEnum[] = [];

  ngOnInit(): void {
    this.api.readUsersMeUsersMeGet().subscribe((user) => {
      this.userScope = user.scopes;
    });
  }

  showInfoClicked(): void {
    this.dialog.open(InfoDialogComponent, {
      width: (window.innerWidth - 100).toString() + "px",
      data: {}
    });
  }

  protected readonly ScopeEnum = ScopeEnum;
}

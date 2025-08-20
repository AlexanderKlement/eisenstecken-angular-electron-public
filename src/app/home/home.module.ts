import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {HomeRoutingModule} from "./home-routing.module";

import {HomeComponent} from "./home.component";
import {SharedModule} from "../shared/shared.module";
import {ChatComponent} from "./chat/chat.component";
import {ChatMessageComponent} from "./chat/chat-message/chat-message.component";
import {MatLegacyCardModule as MatCardModule} from "@angular/material/legacy-card";
import {FlexLayoutModule} from "ng-flex-layout";
import {MatLegacyFormFieldModule as MatFormFieldModule} from "@angular/material/legacy-form-field";
import {MatLegacyInputModule as MatInputModule} from "@angular/material/legacy-input";
import {MatLegacySelectModule as MatSelectModule} from "@angular/material/legacy-select";
import {MatLegacyButtonModule as MatButtonModule} from "@angular/material/legacy-button";
import {ReactiveFormsModule} from "@angular/forms";
import {NoteComponent} from "./note/note.component";
import {SingleNoteComponent} from "./note/single-note/single-note.component";
import {MenuTilesComponent} from "./menu-tiles/menu-tiles.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {SingleMenuTileComponent} from "./menu-tiles/single-menu-tile/single-menu-tile.component";
import {CalendarsChatFrameComponent} from "./calendars-chat-frame/calendars-chat-frame.component";
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from "@angular/material/legacy-progress-spinner";
import {MatLegacyTabsModule as MatTabsModule} from "@angular/material/legacy-tabs";
import {MatIconModule} from "@angular/material/icon";
import {InfoDialogComponent} from "./info-dialog/info-dialog.component";
import {MatLegacyDialogModule as MatDialogModule} from "@angular/material/legacy-dialog";
import { EventCalendarComponent } from "./event-calendar/event-calendar.component";
import { EventCalendarDayComponent } from "./event-calendar/event-calendar-day/event-calendar-day.component";
import {MatToolbarModule} from "@angular/material/toolbar";
import { EventCalendarDialogComponent } from "./event-calendar/event-calendar-dialog/event-calendar-dialog.component";
import {MatLegacyListModule as MatListModule} from "@angular/material/legacy-list";
import { EventCalendarEventComponent } from "./event-calendar/event-calendar-event/event-calendar-event.component";
import {MatLegacyTableModule as MatTableModule} from "@angular/material/legacy-table";

@NgModule({
    declarations: [
        HomeComponent,
        ChatComponent,
        ChatMessageComponent,
        NoteComponent,
        SingleNoteComponent,
        MenuTilesComponent,
        SingleMenuTileComponent,
        CalendarsChatFrameComponent,
        InfoDialogComponent,
        EventCalendarComponent,
        EventCalendarDayComponent,
        EventCalendarDialogComponent,
        EventCalendarEventComponent
    ],
    exports: [
        ChatComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        HomeRoutingModule,
        MatCardModule,
        FlexLayoutModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        MatIconModule,
        MatDialogModule,
        MatToolbarModule,
        MatListModule,
        MatTableModule
    ]
})
export class HomeModule {
}

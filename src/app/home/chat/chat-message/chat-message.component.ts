import {Component, Input, OnInit} from "@angular/core";
import {ChatMessage} from "../../../../api/openapi";
import { NgClass, DatePipe } from "@angular/common";
import { DefaultClassDirective } from "ng-flex-layout/extended";
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { SplitTextNewlinePipe } from "../../../shared/pipes/common";

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
    imports: [NgClass, DefaultClassDirective, MatCard, MatCardHeader, MatIcon, MatCardTitle, MatCardContent, DatePipe, SplitTextNewlinePipe]
})
export class ChatMessageComponent implements OnInit {

  @Input() message: ChatMessage;
  @Input() whatsapp: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

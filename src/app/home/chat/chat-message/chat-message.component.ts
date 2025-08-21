import {Component, Input, OnInit} from "@angular/core";
import {ChatMessage} from "../../../../api/openapi";

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
    standalone: false
})
export class ChatMessageComponent implements OnInit {

  @Input() message: ChatMessage;
  @Input() whatsapp: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

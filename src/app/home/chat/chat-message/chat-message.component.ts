import { Component, Input, OnInit } from '@angular/core';
import { ChatMessage } from '../../../../client/api';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SplitTextNewlinePipe } from '../../../shared/pipes/common';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    DatePipe,
    NgClass,
    MatCardContent,
    NgIf,
    NgForOf,
    SplitTextNewlinePipe,
    MatCardTitle,
  ],
})
export class ChatMessageComponent implements OnInit {
  @Input() message: ChatMessage;
  @Input() whatsapp: boolean;

  constructor() {}

  ngOnInit(): void {
    console.log(
      'Chat MessageComponent initialized with message:',
      this.message
    );
  }
}

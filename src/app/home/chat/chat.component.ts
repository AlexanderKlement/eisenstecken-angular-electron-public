import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChatService} from './chat.service';
import {ChatMessage, ChatRecipient} from 'eisenstecken-openapi-angular-library';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import {ElectronService} from '../../core/services';
import {Router} from '@angular/router';
import {EmailService} from '../../shared/services/email.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

    @ViewChild('chatMsgBox') chatMsgBox: ElementRef;

    messages: ChatMessage[] = [];
    recipients$: Observable<ChatRecipient[]>; //This will fail if we have more than 1 chat component -> ReplaySubject
    whatsapp: boolean;
    chatGroup: FormGroup = new FormGroup({
        messageInput: new FormControl(''),
        recipientSelect: new FormControl(0)
    });

    buttonLocked = false;

    subscription: Subscription;

    constructor(private chatService: ChatService, private electron: ElectronService, private router: Router, private email: EmailService) {
    }

    ngOnInit(): void {
        this.chatService.subscribe();
        this.initIvanStuff();
        this.subscription = new Subscription();
        this.subscription.add(this.chatService.getMessages()
            .subscribe((message: ChatMessage) => {
                this.messages.push(message);
            }));
        this.recipients$ = this.chatService.getRecipients(); //unsubscribes automatically
        if (this.electron.isElectron) {
            this.electron.ipcRenderer.on('app-shown', () => {
                this.chatService.subscribe();
            });
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.chatService.unsubscribe();
    }

    public scrollToBottom(): void {
        try {
            this.chatMsgBox.nativeElement.scrollTop = this.chatMsgBox.nativeElement.scrollHeight;
        } catch (e) {
            console.warn(e);
        }
    }

    public send(): void {
        if (this.chatGroup.value.messageInput == null || this.chatGroup.value.messageInput.length === 0) {
            return;
        }
        this.parseCommands();
        this.lockSendButton();
        if (this.chatGroup.value.messageInput.length === 0) {
            return;
        }
        const chatMessageObservable = this.chatService.sendMessage(this.chatGroup.value.messageInput, this.chatGroup.value.recipientSelect);
        chatMessageObservable.pipe(first()).subscribe(() => {
                this.resetChatControl();
            }, (message) => {
                console.error('Cannot send chat message');
                console.error(message);
            }, () => {
                this.releaseSendButton();
            }
        );
    }

    private resetChatControl() {
        this.chatGroup.reset({
            messageInput: '',
            recipientSelect: 0
        });
    }

    private lockSendButton() {
        this.buttonLocked = true;
    }

    private releaseSendButton() {
        this.buttonLocked = false;
    }

    private initIvanStuff(): void {
        const whatsappSetting = localStorage.getItem('chat-style-whatsapp');
        if (whatsappSetting) {
            this.whatsapp = whatsappSetting === '1';
        } else {
            this.whatsapp = false;
        }
    }

    private parseCommands() {
        const chatInput = this.chatGroup.value.messageInput;
        if (chatInput.startsWith('!beautify')) {
            this.whatsapp = true;
            localStorage.setItem('chat-style-whatsapp', '1');
            this.resetChatControl();
            return;
        }
        if (chatInput.startsWith('!uglify')) {
            this.whatsapp = false;
            localStorage.setItem('chat-style-whatsapp', '0');
            this.resetChatControl();
            return;
        }
        if(chatInput.startsWith('!debug')) {
            this.router.navigateByUrl('debug');
        }
        if(chatInput.startsWith('!mail64')) {
            this.email.setMailPorcessor64();
        }
        if(chatInput.startsWith('!mail86')) {
            this.email.setMailProcessor86();
        }
    }
}


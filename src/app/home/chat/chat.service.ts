import {Injectable, OnDestroy} from '@angular/core';
import {DefaultService, ChatMessageCreate, ChatMessage, ChatRecipient} from 'eisenstecken-openapi-angular-library';
import {Observable, Subscriber} from 'rxjs';
import {first, tap} from 'rxjs/operators';
import {ElectronService} from '../../core/services';
import {TrayService} from '../../shared/services/tray.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService implements OnDestroy {

    private secondsBetweenNewMessageCheck = 5;

    private readonly messages$: Observable<ChatMessage>;
    private readonly amountOfUnreadMessages$: Observable<number>;
    private amountOfUnreadMessagesSubscriber: Subscriber<number>;

    private amountOfUnreadMessages = 0;
    private lastId = 0;
    private lastReadId = 0;
    private messageSubscriber: Subscriber<ChatMessage>;

    private intervals: NodeJS.Timeout[] = [];
    private chatComponentRegistered = true; //This is true, to let the first register happen without consequences

    //TODO: i left a lot of stuff here, because we are not finished yet, but i am leaving it until we are finished

    constructor(private api: DefaultService, private electron: ElectronService, private tray: TrayService) {
        this.initLastMessage();
        this.messages$ = new Observable((messageSubscriber) => {
            this.messageSubscriber = messageSubscriber;
            this.check4Messages();
            this.intervals.push(setInterval(() => { //this can go endlessly, because this service is a singleton ->
                // maybe stop it if there are no active subscribers
                this.check4Messages();
            }, 1000 * this.secondsBetweenNewMessageCheck));
        });
        this.amountOfUnreadMessages$ = new Observable((amountOfUnreadMessagesSubscriber) => {
            this.amountOfUnreadMessagesSubscriber = amountOfUnreadMessagesSubscriber;
        });
        if (this.electron.isElectron) {
            this.electron.ipcRenderer.on('app-hidden', () => {
                this.unsubscribe();
            });
        }
    }

    ngOnDestroy(): void {
        for (const interval of this.intervals) {
            clearInterval(interval);
        }
    }

    public subscribe(): void {
        this.chatComponentRegistered = true;
        this.amountOfUnreadMessages = 0;
        this.updateLastMessageId();
    }

    public unsubscribe(): void {
        this.chatComponentRegistered = false;
    }


    public resetUnreadMessageCount(): void {
        this.amountOfUnreadMessages = 0;
        this.pushUnreadMessageCountToSubscriber();
    }

    public getRecipients(): Observable<ChatRecipient[]> {
        return this.api.readChatRecipientsChatsRecipientsGet();
    }

    public sendMessage(message: string, sendTo: number): Observable<ChatMessage> {
        const chatMessage: ChatMessageCreate = {text: message};
        return this.api.createChatMessageChatsUserIdPost(sendTo, chatMessage).pipe(
            tap(() => {
                this.check4Messages();
            }));
    }

    public getMessages(): Observable<ChatMessage> {
        this.lastId = 0;
        return this.messages$;
    }

    public getAmountOfUnreadMessages(): Observable<number> {
        return this.amountOfUnreadMessages$;
    }

    private check4Messages() {
        this.api.readChatMessagesSinceIdChatsLastIdGet(this.lastId).pipe(first()).subscribe({
            next: messages => {
                messages.forEach((message) => {
                    if (this.lastId < message.id) {
                        this.lastId = message.id;
                    }
                    this.messageSubscriber.next(message);
                    if (!this.chatComponentRegistered) {
                        this.tray.showBalloon('Neue Nachricht von ' + message.sender.fullname, message.text);
                    }
                    this.checkIfUnreadMessageCountNeedsIncrement(message);
                });
            },
            error: msg => {
                console.error('ChatService: Could not check for new Messages. ' +
                    'Retrying in ' + this.secondsBetweenNewMessageCheck.toString() + ' seconds.');
                console.error(msg);
            }
        });
    }

    private pushUnreadMessageCountToSubscriber(): void {
        if (this.amountOfUnreadMessagesSubscriber !== undefined) {
            this.amountOfUnreadMessagesSubscriber.next(this.amountOfUnreadMessages);
        } else {
            console.warn('ChatService: Skipped refreshing unread chat messages, because the Subscriber was not ready yet');
        }
    }

    private checkIfUnreadMessageCountNeedsIncrement(message: ChatMessage): void {
        if (!message.own) {
            this.incrementUnreadMessageCount();
        }
    }

    private incrementUnreadMessageCount(): void {
        if (this.chatComponentRegistered) {
            return;
        }
        this.amountOfUnreadMessages++;
        //this.pushUnreadMessageCountToSubscriber();
    }


    private initLastMessage(): void {
        const lastLocalStorageId = localStorage.getItem('chat-last-id');
        if (lastLocalStorageId == null || lastLocalStorageId.length === 0) {
            return;
        }
        this.lastReadId = parseInt(lastLocalStorageId, 10);
    }

    private updateLastMessageId(): void {
        localStorage.setItem('chat-last-id', this.lastReadId.toString());
    }
}

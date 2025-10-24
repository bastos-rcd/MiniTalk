import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { UserService } from "../../services/user.service";
import { ChatService } from "../../services/chat.service";
import { MessageService } from "../../services/message.service";
import { Message } from "../../models/message.model";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
    username: string = '';
    users: string[] = [];
    messages: Message[] = [];
    typingUsers: string[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private userService: UserService,
        private chatService: ChatService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        const user = this.userService.getUser();

        if (!user) {
            return;
        }

        this.username = user.username;

        this.subscriptions.push(
            this.chatService.onUserList().subscribe(list => this.users = list)
        );

        this.subscriptions.push(
            this.messageService.onMessage().subscribe(msg => {
                if (msg.user !== this.username) {
                    this.messages.push(msg);
                    this.chatService.sendDelivered(msg.id);
                } else {
                    this.messages.push({ ...msg, delivered: false });
                }
            })
        );

        this.subscriptions.push(
            this.chatService.onDelivered().subscribe(data => {
                const msg = this.messages.find(m => m.id === data.msgId && m.user === this.username);
                if (msg) msg.delivered = true;
            })
        );

        this.subscriptions.push(
            this.chatService.onTyping().subscribe(data => {
                if (data.isTyping) {
                    if (!this.typingUsers.includes(data.user)) {
                        this.typingUsers.push(data.user);
                    }
                } else {
                    this.typingUsers = this.typingUsers.filter(u => u !== data.user);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

    sendMessage(event: { text: string; importance: any; color: string }) {
        this.messageService.sendMessage(event.text, event.importance, event.color);
    }
}
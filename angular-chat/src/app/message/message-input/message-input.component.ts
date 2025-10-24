import { Component, EventEmitter, Output } from '@angular/core';

import { Importance } from '../../../models/message.model';
import { ChatService } from '../../../services/chat.service';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
    @Output() send = new EventEmitter<{ text: string; importance: Importance; color: string }>();

    messageText: string = '';
    importance: Importance = 'normal';
    color: string = '#000000';
    private typingTimeout: any;

    constructor(
        private chatService: ChatService,
        private userService: UserService
    ) { }

    onTyping(): void {
        const user = this.userService.getUser();
        if (!user) {
            return;
        }

        this.chatService.emitTyping(true);

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.chatService.emitTyping(false);
        }, 1500);
    }

    onSubmit(): void {
        if (!this.messageText.trim()) {
            return;
        }

        this.send.emit({ text: this.messageText, importance: this.importance, color: this.color });

        const user = this.userService.getUser();
        if (user) {
            this.chatService.emitTyping(false);
        }

        this.messageText = '';
    }
}

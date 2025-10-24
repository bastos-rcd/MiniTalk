import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Importance, Message } from '../models/message.model';
import { ChatService } from './chat.service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messages: Message[] = [];

    constructor(
        private chatService: ChatService
    ) { }

    sendMessage(text: string, importance: Importance, color: string): void {
        this.chatService.sendMessage(text, importance, color);
    }

    onMessage(): Observable<Message> {
        return new Observable(observer => {
            this.chatService.onMessage().subscribe(msg => {
                this.messages.push(msg);
                observer.next(msg);
            });
        });
    }

    getMessages(): Message[] {
        return this.messages;
    }
}
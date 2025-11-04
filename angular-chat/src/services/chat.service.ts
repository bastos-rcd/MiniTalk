import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { Observable } from "rxjs";

import { User } from "../models/user.model";
import { Importance, Message } from "../models/message.model";
import { Typing } from "../models/typing.model";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private socket: Socket;
    private readonly SERVER_URL: string = 'http://localhost:8080'

    constructor() {
        this.socket = io(this.SERVER_URL, { autoConnect: false, reconnection: true });
    }

    connect(user: User): void {
        if (!user.username.trim()) {
            return;

        }
        this.socket.connect();
        this.socket.emit('join', user.username);
    }

    disconnect() {
        this.socket.disconnect();
    }

    onUserList(): Observable<string[]> {
        return new Observable(observer => {
            this.socket.on('userList', (list: string[]) => observer.next(list));
        });
    }

    onTyping(): Observable<Typing> {
        return new Observable(observer => {
            this.socket.on('typing', (data: Typing) => observer.next(data));
        });
    }

    emitTyping(isTyping: boolean) {
        this.socket.emit('typing', isTyping);
    }

    sendMessage(message: string, importance: Importance = 'normal', color: string = '#000000'): void {
        if (!this.socket.connected) return;
        this.socket.emit('message', { message, importance, color });
    }

    onMessage(): Observable<Message> {
        return new Observable(observer => {
            this.socket.on('message', (msg: Message) => observer.next(msg));
        });
    }

    onDelivered(): Observable<{ msgId: number; by: string }> {
        return new Observable(observer => {
            this.socket.on('delivered', (data: { msgId: number; by: string }) => observer.next(data));
        });
    }

    sendDelivered(msgId: number) {
        this.socket.emit('delivered', msgId);
    }
}
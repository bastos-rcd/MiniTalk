import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { User } from "../models/user.model";
import { Observable } from "rxjs";

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
}
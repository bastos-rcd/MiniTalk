import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ChatService } from "../../services/chat.service";
import { User } from "../../models/user.model";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
    username: string = '';
    connected: boolean = false;
    users: string[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit(): void { }

    onSubmit() {
        if (!this.username.trim()) {
            return alert("Pseudo obligatoire !");
        }

        const user: User = { username: this.username };
        this.chatService.connect(user);
        this.connected = true;

        this.subscriptions.push(
            this.chatService.onUserList().subscribe(list => this.users = list)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
        this.chatService.disconnect();
    }
}
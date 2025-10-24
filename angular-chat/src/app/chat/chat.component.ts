import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { UserService } from "../../services/user.service";
import { ChatService } from "../../services/chat.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html'
})
export class ChatComponent implements OnInit, OnDestroy {
    username: string = '';
    users: string[] = [];
    private subscriptions: Subscription[] = [];

    constructor(
        private userService: UserService,
        private chatService: ChatService
    ) { }

    ngOnInit(): void {
        // TEMP
        this.userService.setUser({ username: 'TemporaryUser' });
        const user = this.userService.getUser();

        if (!user) {
            return;
        }

        this.username = user.username;

        this.subscriptions.push(
            this.chatService.onUserList().subscribe(list => this.users = list)
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
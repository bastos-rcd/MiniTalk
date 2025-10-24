import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Message } from '../../../models/message.model';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html'
})
export class MessageListComponent {
    @Input()
    messages: Message[] = [];
    username: string = '';

    constructor(
        private userService: UserService
    ) {
        const user = this.userService.getUser();
        if (user) this.username = user.username;
    }
}
import { Component, Input } from '@angular/core';

import { Message } from '../../../models/message.model';

@Component({
    selector: 'app-message-list',
    templateUrl: './message-list.component.html'
})
export class MessageListComponent {
    @Input()
    messages: Message[] = [];
}
import { Component, EventEmitter, Output } from '@angular/core';
import { Importance } from '../../../models/message.model';

@Component({
    selector: 'app-message-input',
    templateUrl: './message-input.component.html'
})
export class MessageInputComponent {
    messageText: string = '';
    importance: Importance = 'normal';
    color: string = '#000000';

    @Output() send = new EventEmitter<{ text: string; importance: Importance; color: string }>();

    onSubmit(): void {
        if (!this.messageText.trim()) return;
        this.send.emit({ text: this.messageText, importance: this.importance, color: this.color });
        this.messageText = '';
    }
}

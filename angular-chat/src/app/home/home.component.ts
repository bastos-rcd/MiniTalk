import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { UserService } from "../../services/user.service";
import { ChatService } from "../../services/chat.service";
import { User } from "../../models/user.model";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {
    username: string = '';

    constructor(
        private userService: UserService,
        private chatService: ChatService,
        private router: Router
    ) { }

    onSubmit() {
        if (!this.username.trim()) {
            return alert("Pseudo obligatoire !");
        }

        const user: User = { username: this.username };

        this.userService.setUser(user);
        this.chatService.connect(user);

        this.router.navigateByUrl('/chat');
    }
}
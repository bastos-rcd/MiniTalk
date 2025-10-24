<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import { username } from "$lib/stores/user";
  import UserList from "$lib/components/UserList.svelte";
  import { get } from "svelte/store";
  import type { User } from "$lib/models/user";
  import MessageList from "$lib/components/MessageList.svelte";
  import type { Message } from "$lib/models/message";
  import MessageInput from "$lib/components/MessageInput.svelte";
  import TypingIndicator from "$lib/components/TypingIndicator.svelte";

  let socket: any;
  let users: User[] = [];
  let messages: Message[] = [];
  let typingUsers: string[] = [];

  let user = get(username);

  onMount(() => {
    const name = get(username);
    if (!name) {
      window.location.href = "/";
      return;
    }

    socket = io("http://localhost:8080");

    socket.on("connect", () => {
      socket.emit("join", name);
    });

    socket.on("userList", (list: string[]) => {
      users = list.map((u) => ({ username: u }));
    });

    socket.io.on("reconnect", () => {
      socket.emit("join", name);
    });

    socket.on("message", (msg: Message) => {
      messages = [...messages, msg];
    });

    socket.on(
      "typing",
      ({ user: typingUser, isTyping }: { user: string; isTyping: boolean }) => {
        if (!typingUser || typingUser === user) return;

        if (isTyping) {
          if (!typingUsers.includes(typingUser))
            typingUsers = [...typingUsers, typingUser];
        } else {
          typingUsers = typingUsers.filter((u) => u !== typingUser);
        }
      }
    );
  });
</script>

<div class="container-fluid vh-100 d-flex p-0">
  <UserList {users} />

  <div class="flex-grow-1 d-flex flex-column p-3">
    <MessageList {messages} />
    <TypingIndicator {typingUsers} />
    <MessageInput {socket} username={user!} />
  </div>
</div>

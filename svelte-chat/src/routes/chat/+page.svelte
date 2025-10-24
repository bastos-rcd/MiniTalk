<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";
  import { username } from "$lib/stores/user";
  import UserList from "$lib/components/UserList.svelte";
  import { get } from "svelte/store";
  import type { User } from "$lib/models/user";

  let socket: any;
  let users: User[] = [];

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
  });
</script>

<div class="container-fluid vh-100 d-flex p-0">
  <UserList {users} />
  <div class="flex-grow-1 p-3">
    <h5>Chat à venir...</h5>
  </div>
</div>

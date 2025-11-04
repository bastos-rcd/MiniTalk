<script lang="ts">
  import type { Importance } from "$lib/models/message";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let socket: any;
  export let username: string;

  let messageText = "";
  let importance: Importance = "normal";
  let color = "#000000";

  let typingTimeout: any;

  function sendMessage() {
    if (!messageText.trim()) return;

    socket.emit("message", {
      message: messageText,
      importance,
      color,
    });

    messageText = "";
    socket.emit("typing", false);
  }

  function handleTyping() {
    socket.emit("typing", true);

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("typing", false);
    }, 1000);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }
</script>

<div class="input-group mt-2">
  <input
    class="form-control w-75"
    placeholder="Tapez votre message..."
    bind:value={messageText}
    on:input={handleTyping}
    on:keydown={handleKeyDown}
  />

  <select class="form-select" bind:value={importance} style="max-width: 120px;">
    <option value="normal">Normal</option>
    <option value="important">Important</option>
    <option value="urgent">Urgent</option>
  </select>

  <input
    type="color"
    class="form-control form-control-color"
    bind:value={color}
  />

  <button class="btn btn-primary" on:click={sendMessage}>Envoyer</button>
</div>

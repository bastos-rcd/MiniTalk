<script lang="ts">
  import type { Importance, Message } from "$lib/models/message";
  import { username } from "$lib/stores/user";
  import { get } from "svelte/store";

  export let msg: Message;
  let user = get(username);

  const importanceColor = (importance: Importance) => {
    switch (importance) {
      case "urgent":
        return "danger";
      case "important":
        return "warning";
      default:
        return "secondary";
    }
  };
</script>

<div
  class="d-flex justify-content-between align-items-start mb-3 border p-2 rounded"
>
  <div class="d-flex flex-column">
    <small class="text-muted"
      >{new Date(msg.timestamp).toLocaleTimeString()}</small
    >

    <div style="color: {msg.color}">
      <strong style="color: #000000">{msg.user} :</strong>
      {msg.text}
    </div>
  </div>

  <div class="inline-block">
    <span class={`badge bg-${importanceColor(msg.importance)}`}>
      {msg.importance.toUpperCase()}
    </span>
    {#if msg.delivered && msg.user === user}
      <span class="text-success ms-1">✔</span>
    {/if}
  </div>
</div>

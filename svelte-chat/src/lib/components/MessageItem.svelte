<script lang="ts">
  import type { Importance, Message } from "$lib/models/message";

  export let msg: Message;

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

  <span class={`badge bg-${importanceColor(msg.importance)}`}>
    {msg.importance.toUpperCase()}
  </span>
</div>

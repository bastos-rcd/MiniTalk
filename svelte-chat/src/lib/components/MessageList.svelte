<script lang="ts">
  import { onMount, afterUpdate } from "svelte";
  import MessageItem from "./MessageItem.svelte";
  import type { Message } from "$lib/models/message";

  export let messages: Message[] = [];

  let container: HTMLDivElement;

  afterUpdate(() => {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  });
</script>

<div bind:this={container} class="flex-grow-1 overflow-auto mb-3">
  {#each messages as msg (msg.id)}
    <MessageItem {msg} />
  {/each}
</div>

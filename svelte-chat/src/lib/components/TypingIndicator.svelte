<script lang="ts">
  export let typingUsers: string[] = [];
</script>

{#if typingUsers.length > 0}
  <div class="mb-2 text-muted fst-italic">
    {typingUsers.join(", ")}
    {typingUsers.length > 1 ? "écrivent" : "écrit"}...
  </div>
{/if}

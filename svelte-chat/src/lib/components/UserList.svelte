<script lang="ts">
  import type { User } from "$lib/models/user";

  export let users: User[] = [];
</script>

<div class="bg-light border-end p-3" style="width: 250px;">
  <h5>Connectés</h5>
  <ul class="list-group">
    {#each users as user}
      <li class="list-group-item">{user.username}</li>
    {/each}
  </ul>
</div>

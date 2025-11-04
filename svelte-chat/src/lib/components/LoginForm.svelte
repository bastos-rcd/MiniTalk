<script lang="ts">
  import { username as usernameStore } from "$lib/stores/user";
  import { goto } from "$app/navigation";
  let usernameInput = "";

  function connect() {
    if (!usernameInput.trim()) return;
    usernameStore.set(usernameInput);
    goto("/chat");
  }
</script>

<div class="card p-4" style="width: 300px;">
  <h3 class="text-center mb-3">Se connecter</h3>
  <input
    class="form-control mb-3"
    placeholder="Entrez votre pseudo"
    bind:value={usernameInput}
    on:keydown={(e) => e.key === "Enter" && connect()}
  />
  <button class="btn btn-primary w-100" on:click={connect}>Connexion</button>
</div>

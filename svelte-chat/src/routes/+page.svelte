<script lang="ts">
  import LoginForm from "$lib/components/LoginForm.svelte";
  import { goto } from "$app/navigation";

  function handleLogin(event: CustomEvent<string>) {
    const username = event.detail;
    localStorage.setItem("username", username);
    goto("/chat");
  }
</script>

<div class="container d-flex justify-content-center align-items-center vh-100">
  <LoginForm on:login={handleLogin} />
</div>

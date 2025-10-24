<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/chat.css'; // pour les animations douces

const username = ref('');
const router = useRouter();

// limites
const minLen = 3;
const maxLen = 15;

const trimmed = computed(() => username.value.trim());
const length = computed(() => trimmed.value.length);
const valid = computed(() => length.value >= minLen && length.value <= maxLen);
const remaining = computed(() => maxLen - username.value.length);

function joinChat() {
  if (valid.value) {
    localStorage.setItem('username', trimmed.value);
    router.push('/chat');
  } else {
    // simple feedback : on peut améliorer avec toast/alert
    // ici on ne fait rien de particulier, le bouton est désactivé si invalide
  }
}

// empêche de dépasser maxLen via JS (alt: utiliser maxlength sur l'input)
function onInput(e) {
  if (e.target.value.length > maxLen) {
    e.target.value = e.target.value.slice(0, maxLen);
    username.value = e.target.value;
  }
}
</script>

<template>
  <div
    class="d-flex align-items-center justify-content-center min-vh-100 bg-gradient"
  >
    <div
      class="card shadow-lg border-0 rounded-4 text-center p-5 animate-fadeIn"
      style="max-width: 420px; width: 100%; background: rgba(255,255,255,0.95);"
    >
      <!-- Logo / Titre -->
      <h1 class="fw-bold text-primary mb-3 display-5">MiniTalk</h1>
      <p class="text-secondary mb-4">
        Rejoins la conversation instantanément !
      </p>

      <!-- Input -->
      <div class="mb-2">
        <input
          v-model="username"
          @input="onInput"
          :class="['form-control form-control-lg text-center rounded-pill shadow-sm', { 'is-invalid': length < minLen }]"
          type="text"
          placeholder="Entre ton pseudo..."
          :maxlength="maxLen"
        />
        <div class="d-flex justify-content-between mt-2 small px-2">
          <span class="text-danger" v-if="length > 0 && length < minLen">
            Le pseudo doit contenir au moins {{ minLen }} caractères.
          </span>
          <span class="ms-auto text-muted">
            {{ length }} / {{ maxLen }} caractères
          </span>
        </div>
      </div>

      <!-- Button -->
      <button
        @click="joinChat"
        :disabled="!valid"
        class="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-semibold"
      >
        Rejoindre le chat
      </button>

      <!-- Footer -->
      <p class="text-muted small mt-4">
        Pas besoin de compte, choisis un pseudo et c’est parti !
      </p>
    </div>
  </div>
</template>

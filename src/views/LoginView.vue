<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import '../assets/main.css';

const username = ref('');
const router = useRouter();

function joinChat() {
  if (username.value.trim()) {
    localStorage.setItem('username', username.value);
    router.push('/chat');
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-400 to-indigo-700 text-white"
  >
    <div
      class="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-10 w-full max-w-md text-center border border-white/20 animate-fadeIn"
    >
      <!-- Logo / Titre -->
      <h1 class="text-5xl font-extrabold text-white mb-4 tracking-wide drop-shadow-lg">
        MiniTalk
      </h1>
      <p class="text-indigo-100 text-lg mb-10">
        Rejoins la conversation instantanément 
      </p>

      <!-- Input -->
      <div class="mb-6">
        <input
          v-model="username"
          type="text"
          placeholder="Entre ton pseudo..."
          class="w-full bg-white/80 text-gray-800 placeholder-gray-400 rounded-full px-5 py-3 text-center focus:outline-none focus:ring-4 focus:ring-indigo-400 transition-all shadow-md"
        />
      </div>

      <!-- Button -->
      <button
        @click="joinChat"
        class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg hover:shadow-xl transition duration-300 text-lg"
      >
        Rejoindre le chat
      </button>

      <!-- Footer -->
      <p class="text-sm text-indigo-100 mt-8">
        Pas besoin de compte, choisis un pseudo et c’est parti !
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.6s ease-in-out;
}
</style>

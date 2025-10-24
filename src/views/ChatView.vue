<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
import '../assets/main.css';

const socket = io('http://localhost:8080');

const username = localStorage.getItem('username') || 'Inconnu';
const messages = ref([]);
const users = ref([]);
const newMessage = ref('');
const typingUser = ref('');
const isTyping = ref(false);

onMounted(() => {
  socket.emit('join', username);

  socket.on('userList', (list) => {
    users.value = list;
  });

  socket.on('message', (msg) => {
    messages.value.push(msg);
    scrollToBottom();
  });

  socket.on('typing', ({ user, isTyping: typing }) => {
    typingUser.value = typing ? user : null;
  });
});

function sendMessage() {
  if (!newMessage.value.trim()) return;
  socket.emit('message', { message: newMessage.value });
  newMessage.value = '';
}

function startTyping() {
  if (!isTyping.value) {
    isTyping.value = true;
    socket.emit('typing', true);
    setTimeout(() => {
      isTyping.value = false;
      socket.emit('typing', false);
    }, 2000);
  }
}

function scrollToBottom() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox) {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-indigo-200 flex flex-col">
    <!-- Header -->
    <header class="bg-indigo-600 text-white py-5 shadow-lg">
      <h1 class="text-center text-4xl font-extrabold tracking-wider drop-shadow-md">MiniTalk</h1>
    </header>

    <!-- Main Chat Container -->
    <main class="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-6">
      <!-- User Info -->
      <div class="flex justify-between items-center mb-6 text-gray-700">
        <p class="text-sm sm:text-base">
          Connecté en tant que
          <span class="font-semibold text-indigo-700">{{ username }}</span>
        </p>
        <p
          class="text-xs sm:text-sm bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full font-medium shadow-sm"
        >
          {{ users.length }} utilisateur<span v-if="users.length > 1">s</span> en ligne
        </p>
      </div>

      <!-- Messages -->
      <div
        id="chat-box"
        class="flex-1 border border-gray-200 rounded-2xl p-5 bg-white overflow-y-auto shadow-inner mb-4"
      >
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="mb-4 flex flex-col animate-fadeIn"
        >
          <div
            class="inline-block px-5 py-3 rounded-2xl shadow-md transition-transform duration-200"
            :class="msg.user === username
              ? 'self-end bg-indigo-600 text-white rounded-br-none'
              : 'self-start bg-gray-100 text-gray-800 rounded-bl-none'"
          >
            <p class="text-xs font-semibold mb-1 opacity-80">{{ msg.user }}</p>
            <p class="break-words text-base leading-relaxed">{{ msg.text }}</p>
            <span class="text-[10px] opacity-70 block mt-1 text-right italic">
              {{ new Date(msg.timestamp).toLocaleTimeString() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Typing indicator -->
      <div v-if="typingUser" class="text-gray-500 text-sm mb-3 italic">
        {{ typingUser }} est en train d’écrire...
      </div>

      <!-- Input Area -->
      <div class="flex items-center gap-3 bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
        <input
          v-model="newMessage"
          @input="startTyping"
          @keyup.enter="sendMessage"
          placeholder="Écris un message..."
          class="flex-1 px-3 py-2 text-gray-700 focus:outline-none rounded-full"
        />
        <button
          @click="sendMessage"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition duration-200"
        >
          ➤
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}
</style>

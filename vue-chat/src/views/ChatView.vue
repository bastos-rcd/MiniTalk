<script setup>
import { ref, onMounted } from 'vue';
import { io } from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/chat.css';

const socket = io('http://localhost:8080');

const username = localStorage.getItem('username') || 'Inconnu';
const messages = ref([]);
const users = ref([]);
const newMessage = ref('');
const typingUser = ref('');
const isTyping = ref(false);
const importance = ref('normal');

let typingTimeout = null;

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
    if (typing) {
      typingUser.value = user;
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        typingUser.value = '';
      }, 2000);
    }
  });
});

function sendMessage() {
  if (!newMessage.value.trim()) return;
  socket.emit('message', {
    message: newMessage.value,
    importance: importance.value,
  });
  newMessage.value = '';
}

function startTyping() {
  if (!isTyping.value) {
    isTyping.value = true;
    socket.emit('typing', { user: username, isTyping: true });
    setTimeout(() => {
      isTyping.value = false;
      socket.emit('typing', { user: username, isTyping: false });
    }, 1500);
  }
}

function scrollToBottom() {
  const chatBox = document.getElementById('chat-box');
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}

function getImportanceStyle(level) {
  switch (level) {
    case 'important':
      return 'bg-warning text-dark';
    case 'urgent':
      return 'bg-danger text-white';
    default:
      return 'bg-dark text-white';
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex flex-column bg-light">
    <!-- HEADER -->
    <header class="bg-primary text-white py-3 shadow-sm">
      <h1 class="text-center fw-bold">MiniTalk</h1>
    </header>

    <!-- MAIN -->
    <main class="container my-4 flex-grow-1">
      <div class="row g-4">
        <!-- CHAT -->
        <div class="col-md-8">
          <div class="card shadow-lg border-0 rounded-4 h-100">
            <div class="card-body d-flex flex-column">
              <!-- Info utilisateur -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <p class="text-muted mb-0">
                  Connecté en tant que <strong class="text-primary">{{ username }}</strong>
                </p>
                <span class="badge bg-primary">
                  {{ users.length }} utilisateur<span v-if="users.length > 1">s</span>
                </span>
              </div>

              <!-- Messages -->
              <div
                id="chat-box"
                class="flex-grow-1 overflow-auto border rounded-3 p-3 bg-white mb-3"
                style="max-height: 60vh;"
              >
                <div
                  v-for="msg in messages"
                  :key="msg.id"
                  class="d-flex flex-column mb-3 animate-fadeIn"
                  :class="msg.user === username ? 'align-items-end' : 'align-items-start'"
                >
                  <div
                    class="p-3 rounded-3 shadow-sm text-wrap"
                    :class="[
                      msg.user === username
                        ? 'bg-primary text-white rounded-end-0'
                        : getImportanceStyle(msg.importance),
                    ]"
                    style="max-width: 75%;"
                  >
                    <div class="small fw-semibold mb-1">
                      {{ msg.user }}
                      <span
                        v-if="msg.importance !== 'normal'"
                        class="ms-2 badge"
                        :class="msg.importance === 'urgent' ? 'bg-danger' : 'bg-warning text-dark'"
                      >
                        {{ msg.importance }}
                      </span>
                    </div>
                    <p class="mb-1">{{ msg.text }}</p>
                    <small class="text-opacity-75 fst-italic">
                      {{ new Date(msg.timestamp).toLocaleTimeString() }}
                    </small>
                  </div>
                </div>
              </div>

              <!-- Indicateur de frappe -->
              <transition name="fade">
                <div v-if="typingUser" class="text-muted small fst-italic mb-2">
                  🔴 {{ typingUser }} est en train d’écrire...
                </div>
              </transition>

              <!-- Saisie -->
              <div class="input-group mt-auto">
                <select v-model="importance" class="form-select w-auto">
                  <option value="normal">Normal</option>
                  <option value="important">Important</option>
                  <option value="urgent">Urgent</option>
                </select>
                <input
                  v-model="newMessage"
                  @input="startTyping"
                  @keyup.enter="sendMessage"
                  type="text"
                  placeholder="Écris un message..."
                  class="form-control"
                />
                <button @click="sendMessage" class="btn btn-primary">
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- UTILISATEURS CONNECTÉS -->
        <div class="col-md-4">
          <div class="card shadow-lg border-0 rounded-4 h-100">
            <div class="card-header bg-primary text-white fw-semibold text-center">
              Utilisateurs connectés
            </div>
            <ul class="list-group list-group-flush overflow-auto" style="max-height: 60vh;">
              <li
                v-for="user in users"
                :key="user"
                class="list-group-item text-center"
                :class="user === username ? 'bg-primary text-white fw-semibold' : ''"
              >
                {{ user }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

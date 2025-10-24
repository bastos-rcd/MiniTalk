import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Message from "./message";

function Home() {
  const [name, setName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connecté au serveur");
    });

    // Écouter les messages
    newSocket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Écouter la liste des utilisateurs
    newSocket.on("userList", (users) => {
      setConnectedUsers(users);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = () => {
    if (name.trim() === "") return;
    socket.emit("join", name);
    setConnected(true);
  };

  const handleMessageSend = () => {
    if (messageText.trim() === "" || !socket) return;
    socket.emit("message", {
      user: name,
      message: messageText,
      importance: "normal",
      color: "black",
      timestamp: Date.now(),
    });
    setMessageText("");
  };

  const messagesList = messages.map((msg, key) => (
    <Message key={key} user={msg.user} text={msg.text} time={msg.timestamp} />
  ));

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (connected) {
        handleMessageSend();
      } else {
        handleSubmit();
      }
    }
  };

  return (
    <div className={styles.container}>
      {!connected && (
        <div className={styles.loginContainer}>
          <h1 className={styles.title}>MiniTalk - Chat Instantané</h1>
          <div className={styles.loginForm}>
            <input
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              onChange={(e) => setName(e.target.value)}
              value={name}
              onKeyPress={handleKeyPress}
              className={styles.usernameInput}
            />
            <button onClick={handleSubmit} className={styles.joinButton}>
              Rejoindre le chat
            </button>
          </div>
        </div>
      )}

      {connected && (
        <div className={styles.chatContainer}>
          <header className={styles.chatHeader}>
            <h1>MiniTalk</h1>
            <div className={styles.userInfo}>
              Connecté en tant que <strong>{name}</strong>
            </div>
          </header>

          <div className={styles.chatMain}>
            <div className={styles.messagesContainer}>
              <div className={styles.messages}>{messagesList}</div>
            </div>

            <div className={styles.sidebar}>
              <h3>Utilisateurs connectés ({connectedUsers.length})</h3>
              <ul className={styles.usersList}>
                {connectedUsers.map((user, index) => (
                  <li key={index} className={styles.userItem}>
                      {user}
                      <span className={styles.userStatus}></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.inputRow}>
            <input
              type="text"
              placeholder="Tapez votre message..."
              onChange={(e) => setMessageText(e.target.value)}
              value={messageText}
              className={styles.messageInput}
              onKeyPress={handleKeyPress}
            />
            <button onClick={handleMessageSend} className={styles.sendButton}>
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

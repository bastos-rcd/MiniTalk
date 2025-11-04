import styles from "../styles/Home.module.css";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Message from "./message";

function Home() {
  const [name, setName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [importance, setImportance] = useState("normal");

  const nameRef = useRef("");
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connecté au serveur");
    });

    // Écouter les messages
    newSocket.on("message", (message) => {
      setMessages((prev) => {
        const existing = prev.find((m) => m.id === message.id);
        if (existing) {
          return prev.map((m) =>
            m.id === message.id ? { ...m, ...message } : m
          );
        } else {
          return [...prev, { ...message, deliveredBy: [] }];
        }
      });

      if (message.user !== nameRef.current) {
        newSocket.emit("delivered", message.id);
      }
    });

    // Écouter la liste des utilisateurs
    newSocket.on("userList", (users) => {
      setConnectedUsers(users);
    });

    // Écouter les indicateurs de frappe
    newSocket.on("typing", ({ user, isTyping }) => {
      setTypingUsers((prev) => {
        const updatedList = prev.filter((u) => u !== user);
        if (isTyping) {
          return [...updatedList, user];
        }
        return updatedList;
      });
    });

    newSocket.on("delivered", ({ msgId, by }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === msgId
            ? {
                ...msg,
                deliveredBy: [...new Set([...(msg.deliveredBy || []), by])],
              }
            : msg
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSubmit = () => {
    if (name.trim() === "" || !socket) return;
    setName(name.trim());
    socket.emit("join", name.trim());
    setConnected(true);
  };

  const handleMessageSend = () => {
  if (messageText.trim() === "" || !socket) return;

  if (isTyping) {
    socket.emit("typing", false);
    setIsTyping(false);
  }

  let messageColor = "black";
  if (importance === "important") messageColor = "red";
  if (importance === "urgent") messageColor = "orange";

  socket.emit("message", {
    id: Date.now(),
    message: messageText.trim(),
    importance,
    color: messageColor,
  });

  setMessageText("");
};

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setMessageText(newValue);

    if (!socket) return;

    if (newValue.trim() !== "") {
      socket.emit("typing", true);
      setIsTyping(true);
    } else if (newValue.trim() === "") {
      socket.emit("typing", false);
      setIsTyping(false);
    }
  };

  const messagesList = messages.map((msg, key) => {
    return (
      <div style={{ color: msg.color }}>
        <Message
          key={key}
          user={msg.user}
          message={msg.text}
          time={msg.timestamp}
          deliveredBy={msg.deliveredBy || []}
          currentUser={name}
        />
      </div>
    );
  });

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
            <button
              onClick={() => {
                setConnected(false);
                socket.disconnect();
              }}
              className={styles.leaveButton}
            >
              Quitter le chat
            </button>
          </header>

          <div className={styles.chatMain}>
            <div className={styles.messagesContainer}>
              <div className={styles.messages}>
                {messagesList}

                {/* Afficher qui tape (autres utilisateurs) */}
                {typingUsers.length > 0 && (
                  <div className={styles.typingIndicator}>
                    {typingUsers.join(", ")}{" "}
                    {typingUsers.length === 1 ? "tape" : "tapent"}...
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
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
              onChange={handleInputChange}
              value={messageText}
              className={styles.messageInput}
              onKeyPress={handleKeyPress}
              maxLength={500}
            />
            <select
              className={styles.importanceSelect}
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </select>
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

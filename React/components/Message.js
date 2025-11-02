import styles from "../styles/Message.module.css";

const Message = ({ user, message, time, color, deliveredBy, currentUser }) => {  
  return (
    <div className={styles.message}>
      <div className={styles.messageHeader}>
        <span className={styles.messageUser}>{user}</span>
        <span className={styles.messageTime}>
          {new Date(time).toLocaleTimeString()}
        </span>
      </div>
      <div className={styles.messageText} style={{ color: color }}>
        {message}
        {/* Afficher ✅ seulement pour mes propres messages qui ont été vus */}
        {user === currentUser && deliveredBy && deliveredBy.length > 0 && (
          <span> ✅</span>
        )}
      </div>
    </div>
  );
};

export default Message;

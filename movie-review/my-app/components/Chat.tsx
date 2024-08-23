import { useAuthStore } from '../stores/useAuthStore';
import { useState, useEffect } from 'react';
import styles from '../styles/Chat.module.css';

const Chat = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.token) return;

    const socket = new WebSocket(`ws://localhost:4000?user=${user.token}`);

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket);  // WebSocket이 연결되면 상태를 업데이트
    };

    socket.onmessage = (event: MessageEvent) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setWs(null);  // WebSocket이 닫히면 상태를 null로 설정
    };

    return () => {
      socket.close();
    };
  }, [isLoggedIn, user?.token]);

  const sendMessage = () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open');
      return;
    }

    if (input.trim() === '') {
      console.error('Input is empty');
      return;
    }

    ws.send(input);
    setInput('');  // 전송 후 입력 필드를 비웁니다.
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>실시간 채팅</div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      {isLoggedIn ? (
        <div className={styles.chatInputContainer}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className={styles.chatInput}
            placeholder="메시지를 입력하세요..."
          />
          <button onClick={sendMessage} className={styles.chatSendButton}>
            전송
          </button>
        </div>
      ) : (
        <div className={styles.chatLoginMessage}>
          로그인 후 이용해주세요.
        </div>
      )}
    </div>
  );
};

export default Chat;

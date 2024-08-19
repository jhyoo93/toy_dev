import { useState, useEffect } from 'react';
import styles from '../styles/Chat.module.css'; // 스타일 파일 가져오기

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    socket.onmessage = (event: MessageEvent) => {
      const newMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event);
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && input) {
      ws.send(input);
      setInput('');
    } else {
      console.error('WebSocket is not open or input is empty');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>채팅방 🎁</div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.chatInput}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage} className={styles.chatSendButton}>
          전송
        </button>
      </div>
    </div>
  );
};

export default Chat;

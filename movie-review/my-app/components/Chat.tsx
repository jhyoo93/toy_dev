import { useAuthStore } from '../stores/useAuthStore';
import { useState, useEffect } from 'react';
import styles from '../styles/Chat.module.css';

const Chat = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user?.token) {
      console.log('User is not logged in or token is missing');
      return;
    }
  
    console.log('Attempting to connect to WebSocket server...');
    const socket = new WebSocket(`ws://localhost:4000?user=${user.token}`);
    
    socket.onopen = () => {
      console.log('Connected to WebSocket server');
      setWs(socket);
  
      const welcomeMessage = `${user.username}님이 입장하셨습니다.`;
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);
    };
  
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  
    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setWs(null);
    };
  
    socket.onmessage = (event: MessageEvent) => {
      console.log('Received message:', event.data);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };
    console.log(socket);
    // Cleanup on component unmount
    return () => {
      console.log('Cleaning up WebSocket connection');
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [isLoggedIn, user?.token]);

  const sendMessage = () => {
    console.log(ws);
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not open');
      return;
    }

    if (input.trim() === '') {
      console.error('Input is empty');
      return;
    }

    console.log('Sending message:', input);
    ws.send(input);
    setMessages((prevMessages) => [...prevMessages, `You: ${input}`]); // Sent message is now also displayed in the chat
    setInput('');
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>실시간 채팅</div>
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
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className={styles.chatInput}
          placeholder={isLoggedIn ? "메시지를 입력하세요..." : "로그인 후 채팅을 이용하실 수 있습니다."}
          disabled={!isLoggedIn}
        />
        <button onClick={sendMessage} className={styles.chatSendButton} disabled={!isLoggedIn}>
          {isLoggedIn ? "전송" : "잠금"}
        </button>
      </div>
    </div>
  );
};

export default Chat;

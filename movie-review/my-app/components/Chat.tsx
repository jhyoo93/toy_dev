import { useState, useEffect } from 'react';
import styles from '../styles/Chat.module.css';

const Chat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:4000');  // 서버가 4000 포트에서 실행 중

    socket.onopen = () => {
      console.log('WebSocket server 연결성공!');
    };

    socket.onmessage = (event: MessageEvent) => {
      // 이벤트 데이터가 Blob 형식인지 확인하고, Blob인 경우 텍스트로 변환
      if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          if (typeof text === 'string') {
            setMessages((prevMessages) => [...prevMessages, text]);
          }
        };
        reader.readAsText(event.data);
      } else {
        // 데이터가 문자열이라면 그대로 처리
        setMessages((prevMessages) => [...prevMessages, event.data]);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket 에러발생!:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection 종료!:', event.code, event.reason);
      // Reconnect logic can be added here if needed
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>실시간 채팅</div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div key={index}>닉네임 : {message}</div>
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
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

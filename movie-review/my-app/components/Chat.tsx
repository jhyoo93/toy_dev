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
      setWs(socket);  // WebSocket 연결이 성공하면 설정

      // WebSocket 연결 성공 시 입장 메시지 추가
      const welcomeMessage = `${user.username}님이 입장하셨습니다.`;
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);
    };

    socket.onmessage = (event: MessageEvent) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      setWs(null);  // 연결이 닫히면 WebSocket 상태를 초기화
    };

    return () => {
      socket.close();  // 컴포넌트 언마운트 시 WebSocket 연결 닫기
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
    setInput('');  // 메시지 전송 후 입력 필드 초기화
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
          disabled={!isLoggedIn}  // 로그인되지 않았을 때 입력 비활성화
        />
        <button onClick={sendMessage} className={styles.chatSendButton} disabled={!isLoggedIn}>
          {isLoggedIn ? "전송" : "잠금"}  {/* 로그인되지 않으면 버튼도 비활성화 */}
        </button>
      </div>
    </div>
  );
};

export default Chat;

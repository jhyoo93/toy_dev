import { createServer } from 'http';
import { WebSocketServer } from 'ws';

// HTTP 서버 생성
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

// WebSocket 서버 생성
const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress; // 클라이언트의 IP 주소 확인
  console.log(`Client connected from ${ip}`);

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send(`Server received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// HTTP 및 WebSocket 서버가 3000 포트에서 실행됨
server.listen(4000, () => {
  console.log('Server is running on http://127.0.0.1:4000');
});

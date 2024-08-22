import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server running\n');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');

  ws.on('message', (message: string) => {
    console.log(`Received message: ${message}`);
    // Broadcasting the received message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed: ${code}, ${reason}`);
  });
});

server.listen(4000, () => {
  console.log('WebSocket server is listening on port 4000');
});

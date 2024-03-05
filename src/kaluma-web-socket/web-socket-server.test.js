const WebSocketServer = require('./web-socket-server');
const WebSocket = require('ws');

let webSocketServer;

afterAll(() => {
  webSocketServer && webSocketServer.close();
});

it('returns a 101 for a correctly formatted Upgrade request', async () => {
  webSocketServer = await WebSocketServer.CreateServer(8856);

  const ws = new WebSocket('ws://localhost:8856', {
    perMessageDeflate: false
  });

  // return new Promise((resolve, reject) => {
  ws.on('error', () => {
    reject(Error('Error connecting'));
  });

  ws.on('open', () => {
    resolve();
  });

  ws.on('unexpected-response', () => {
    reject(Error('Error connecting2'));
  });

  ws.on('upgrade', () => {
    reject(Error('Error connecting3'));
  });
  // });
});

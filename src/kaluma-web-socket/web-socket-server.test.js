const WebSocketServer = require('./web-socket-server');
const WebSocket = require('ws');
const axios = require('axios');

let webSocketServer;

beforeAll(async () => {
  webSocketServer = await WebSocketServer.CreateServer(8856);
});

afterAll(async () => {
  await webSocketServer.close();
});

it('should open a connection to the websocket', async () => {
  const ws = new WebSocket('ws://localhost:8856', {
    perMessageDeflate: false
  });

  return new Promise((resolve, reject) => {
    ws.on('error', (err) => {
      ws.close();
      reject(err);
    });

    ws.on('open', () => {
      ws.close();
      resolve();
    });
  });
});

it('should return a 404 for non-upgrade requests', async () => {
  const response = await axios.get('http://localhost:8856', {
    validateStatus: false
  });
  return expect(response.status).toEqual(404);
});

it('should return a 400 for upgrade requests with no sec-websocket-key', async () => {
  const response = await axios.get('http://localhost:8856', {
    validateStatus: false,
    headers: {
      upgrade: 'websocket',
      connection: 'Upgrade'
    }
  });
  return expect(response.status).toEqual(400);
});

it('should return a 400 for upgrade requests with no invalid sec-websocket-key', async () => {
  const response = await axios.get('http://localhost:8856', {
    validateStatus: false,
    headers: {
      upgrade: 'websocket',
      connection: 'Upgrade',
      'sec-websocket-key': 'NOT_A_KEY'
    }
  });
  return expect(response.status).toEqual(400);
});

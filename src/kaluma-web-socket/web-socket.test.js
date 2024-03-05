const WebSocket = require('./web-socket');
const { Socket } = require('node:net');
const { Frame } = require('./frame');

it('returns a pong when it receives a ping', () => {
  const socket = new Socket();
  const webSocket = new WebSocket(socket);

  socket.emit('data', Frame.buildPing().toBuffer());

  webSocket.
});

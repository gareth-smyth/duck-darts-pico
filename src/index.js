/*
 * [duck-darts-pco]{@link https://github.com/gareth-smyth/duck-darts-pico}
 *
 * @license MIT
 */

const { WiFi } = require('wifi');
const WebSocketServer = require('./kaluma-web-socket');

const wifi = new WiFi();

console.log('Duck Darts starting...');
console.log('Starting WiFi.');

wifi.connect({}, async (err) => {
  if (err) {
    console.error('WiFi error:', err);
  } else {
    console.log('Wifi Started.');
    WebSocketServer.CreateServer(8124).then((webSocketServer) => {
      webSocketServer.onMessageReceived((message) => {
        console.log('Message received: ', message);
        webSocketServer.sendMessage('Hello back!');
      });
    });
  }
});

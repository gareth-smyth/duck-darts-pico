/*
 * [duck-darts-pco]{@link https://github.com/gareth-smyth/duck-darts-pico}
 *
 * @license MIT
 */

const { WiFi } = require('wifi');
const http = require('http');

const WebSocket = require('./kaluma-web-socket');
const sha1 = require('js-sha1');

const wifi = new WiFi();

console.log('Duck Darts starting...');
console.log('Starting WiFi.');

wifi.connect({}, (err) => {
  if (err) {
    console.error('WiFi error:', err);
  } else {
    console.log('Wifi Started.');
    console.log('Creating HTTP server.');
    const server = http.createServer((req, res) => {
      console.log('HTTP Server received a request.');

      // TODO - check the request is what we expect?

      const webSocket = new WebSocket(req.socket);

      console.log(req.headers);

      const keySource = req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
      const sha = sha1.digest(keySource);
      const digest = btoa(String.fromCharCode.apply(null, sha));

      res.writeHead(101, 'Switching Protocols', {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
        'Sec-WebSocket-Accept': digest
      });

      console.log('HTTP response to switch to websocket protocol.');
    });

    console.log('Starting HTTP server.');
    server.listen(8124, () => {
      console.log('HTTP server listening on port: ' + 8124);
    });
  }
});

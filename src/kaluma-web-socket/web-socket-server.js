const http = require('http');
const sha1 = require('js-sha1');

class WebSocketServer {
  static async CreateServer (port) {
    const webSocketServer = new WebSocketServer();
    webSocketServer.server = http.createServer(webSocketServer.requestHandler);
    return new Promise((resolve, reject) => {
      webSocketServer.server.listen(port, () => {
        resolve(webSocketServer);
      });
      webSocketServer.server.on('error', e => {
        reject(e);
      });
      webSocketServer.server.on('close', () => {
        console.log('closed');
      });
    });
  }

  async close () {
    return this.server && new Promise((resolve) => {
      this.server.close(() => {
        resolve();
      });
    });
  }

  requestHandler (req, res) {
    const keySource = req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const sha = sha1.digest(keySource);
    const digest = btoa(String.fromCharCode.apply(null, sha));

    console.log(req.headers, digest);

    res.writeHead(101, 'Switching Protocols', {
      Upgrade: 'websocket',
      Connection: 'Upgrade',
      'Sec-WebSocket-Accept': digest
    });
  }
}

module.exports = WebSocketServer;

const http = require('http');
const { sha1 } = require('js-sha1');
const WebSocket = require('./web-socket');

class WebSocketServer {
  constructor () {
    this.connections = [];
  }

  static async CreateServer (port) {
    const webSocketServer = new WebSocketServer();
    webSocketServer.server = http.createServer((req, res) => webSocketServer.requestHandler(req, res, webSocketServer));
    return new Promise((resolve, reject) => {
      webSocketServer.server.listen(port, () => {
        resolve(webSocketServer);
      });

      webSocketServer.server.on('error', /* istanbul ignore next  */ (e) => {
        console.log(e);
        reject(e);
      });
    });
  }

  close () {
    return this.server && new Promise((resolve) => {
      this.connections.forEach((connection) => {
        connection.socket && connection.socket.destroy();
      });
      this.server.close(() => {
        resolve();
      });
    });
  }

  requestHandler (req, res, webSocketServer) {
    const upgradeHeader = req.headers.upgrade;
    const connectionHeader = req.headers.connection;
    const keyHeader = req.headers['sec-websocket-key'];

    if (upgradeHeader !== 'websocket' || connectionHeader !== 'Upgrade') {
      res.writeHead(404, 'Not Found');
      res.end();
    } else {
      const cleanKeyHeader = keyHeader && keyHeader.trim();
      if (!cleanKeyHeader || cleanKeyHeader.length !== 24) {
        res.writeHead(400, 'Bad Request');
        res.end();
      }

      const keySource = cleanKeyHeader + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
      const sha = sha1.digest(keySource);
      const digest = btoa(String.fromCharCode.apply(null, sha));

      webSocketServer.connections.push(new WebSocket(req.socket));

      res.writeHead(101, 'Switching Protocols', {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
        'Sec-WebSocket-Accept': digest
      });
      res.flushHeaders();
    }
  }
}

module.exports = WebSocketServer;

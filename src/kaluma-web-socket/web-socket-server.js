const http = require('http');
const { sha1 } = require('js-sha1');
const WebSocketConnection = require('./web-socket-connection');

class WebSocketServer {
  constructor () {
    this.connections = [];
    this.messageReceivedHanlders = [];
  }

  static async CreateServer (port) {
    console.log('Creating WebSocket server');
    const webSocketServer = new WebSocketServer();
    webSocketServer.server = http.createServer((req, res) => webSocketServer._requestHandler(req, res, webSocketServer));
    console.log('Created HTTP server');
    return new Promise((resolve, reject) => {
      webSocketServer.server.listen(port, () => {
        console.log(`Listening on port ${port}`);
        resolve(webSocketServer);
      });

      webSocketServer.server.on('error', /* istanbul ignore next  */ (e) => {
        console.error(e);
        reject(e);
      });
    }).catch((e) => {
      console.error(e);
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

  onMessageReceived (messageHandler) {
    this.messageReceivedHanlders.push(messageHandler);
  }

  handleMessage (message) {
    this.messageReceivedHanlders.forEach(messageHandler => {
      messageHandler(message);
    });
  }

  sendMessage (message) {
    this.connections.forEach((connection) => {
      connection.sendMessage(message);
    });
  }

  _requestHandler (req, res, webSocketServer) {
    console.log('Received request');

    const upgradeHeader = req.headers.upgrade;
    const connectionHeader = req.headers.connection;
    const keyHeader = req.headers['sec-websocket-key'];

    if (upgradeHeader !== 'websocket' || connectionHeader !== 'Upgrade') {
      console.log('Received non-upgrade request');
      res.writeHead(404, 'Not Found');
      res.end();
    } else {
      const cleanKeyHeader = keyHeader && keyHeader.trim();
      if (!cleanKeyHeader || cleanKeyHeader.length !== 24) {
        console.log('Received bad key');
        res.writeHead(400, 'Bad Request');
        res.end();
        return;
      }

      console.log('Upgrading connection');
      const keySource = cleanKeyHeader + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
      const sha = sha1.digest(keySource);
      const digest = btoa(String.fromCharCode.apply(null, sha));

      webSocketServer.connections.push(new WebSocketConnection(req.socket, webSocketServer));

      res.writeHead(101, 'Switching Protocols', {
        Upgrade: 'websocket',
        Connection: 'Upgrade',
        'Sec-WebSocket-Accept': digest
      });
      res.flushHeaders();

      console.log('Responded with protocol switch');
    }
  }
}

module.exports = WebSocketServer;

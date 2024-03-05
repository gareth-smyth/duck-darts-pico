const { Frame } = require('./frame.js');
const { FrameOpCode } = require('./frame');

class WebSocketConnection {
  constructor (socket, webSocketServer) {
    this.socket = socket;
    this.webSocketServer = webSocketServer;

    this.socket.on('data', (data) => {
      console.log('Got data');
      const frame = new Frame(data);
      console.log(JSON.stringify(frame, null, 2));
      console.log(frame.payLoadData.toString());

      if (frame.opCode === FrameOpCode.text) {
        this.webSocketServer.handleMessage(new TextDecoder().decode(frame.payLoadData));
      }
    });

    this.socket.on('end', () => {
      console.log('client disconnected');
    });

    this.socket.on('error', (err) => {
      console.log('client error', err);
    });
  }

  sendMessage (message) {
    this.socket.write(Frame.buildText(message).toBuffer());
  }

  close () {
    this.socket.close();
  }
}

module.exports = WebSocketConnection;

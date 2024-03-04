const { Frame } = require('./frame.js');

class WebSocket {
  constructor (socket) {
    this.socket = socket;

    this.socket.on('data', (data) => {
      console.log('Got data');
      const frame = new Frame(data);
    });

    this.socket.on('end', () => {
      console.log('client disconnected');
    });

    this.socket.on('error', (err) => {
      console.log('client error', err);
    });
  }
}

module.exports = WebSocket;

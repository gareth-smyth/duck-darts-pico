const FrameOpCode = {
  text: 0x1
};

const ControlOpCodes = [0x8, 0x9, 0xa];

class Frame {
  constructor (data) {
    if (data) {
      this.fin = (data[0] & 0x80) === 0x80;
      this.rsv1 = (data[0] & 0x40) === 0x40;
      this.rsv2 = (data[0] & 0x20) === 0x20;
      this.rsv3 = (data[0] & 0x10) === 0x10;

      if (this.rsv1 === true) {
        throw Error('rsv1 should not be set');
      }

      if (this.rsv2 === true) {
        throw Error('rsv2 should not be set');
      }

      if (this.rsv3 === true) {
        throw Error('rsv3 should not be set');
      }

      this.opCode = data[0] & 0x0f;

      if ((this.opCode >= 3 && this.opCode < 8) ||
        (this.opCode > 10)) {
        throw Error(`reserved opcode ${this.opCode} is not allowed`);
      }

      this.payloadLength = data[1] & 0x7f;
      this.fullPayloadLength = this.payloadLength;

      if (ControlOpCodes.includes(this.opCode) && !this.fin) {
        throw Error(`control code ${this.opCode} must be final`);
      }

      if (ControlOpCodes.includes(this.opCode) && this.payloadLength > 125) {
        throw Error(`control code ${this.opCode} must not have an extended payload`);
      }

      this.mask = (data[1] & 0x80) === 0x80;

      let payloadStartPos = 2;
      let maskStartPos = 2;

      if (this.payloadLength === 126) {
        payloadStartPos += 2;
        maskStartPos += 2;
        this.fullPayloadLength = (data[2] << 8) | data[3];
      } else if (this.payloadLength === 127) {
        payloadStartPos += 8;
        maskStartPos += 8;
        this.fullPayloadLength = (data[2] << 56) | (data[3] << 48) | (data[4] << 40) | (data[5] << 32) |
          (data[6] << 24) | (data[7] << 16) | (data[8] << 8) | data[9];
      }

      if (this.mask === true) {
        this.maskingKey = [data[maskStartPos], data[maskStartPos + 1], data[maskStartPos + 2], data[maskStartPos + 3]];
        payloadStartPos += 4;
      }

      this.payLoadData = data.slice(payloadStartPos, payloadStartPos + this.fullPayloadLength);

      if (this.mask === true) {
        this.unmask(this.payLoadData, this.maskingKey);
      }
    }
  }

  toBuffer () {
    let fullLength = 2 + this.payLoadData.length;

    if (this.mask) {
      fullLength += 4;
    }

    if (this.payloadLength === 126) {
      fullLength += 2;
    } else if (this.payloadLength === 127) {
      fullLength += 8;
    }

    const buffer = Buffer.alloc(fullLength);

    buffer[0] = this.fin << 8;
    buffer[0] = buffer[0] & this.opCode;

    buffer[1] = this.mask << 8;
    buffer[1] = buffer[1] & this.payloadLength;

    let nextByte = 2;
    if (this.payloadLength === 126) {
      buffer[2] = this.fullPayloadLength >> 8;
      buffer[3] = this.fullPayloadLength;
      nextByte += 2;
    }

    if (this.payloadLength === 127) {
      buffer[2] = this.fullPayloadLength >> 56;
      buffer[3] = this.fullPayloadLength >> 48;
      buffer[4] = this.fullPayloadLength >> 40;
      buffer[5] = this.fullPayloadLength >> 32;
      buffer[6] = this.fullPayloadLength >> 24;
      buffer[7] = this.fullPayloadLength >> 16;
      buffer[8] = this.fullPayloadLength >> 8;
      buffer[9] = this.fullPayloadLength;
      nextByte += 8;
    }

    if (this.mask) {
      buffer[nextByte] = this.maskingKey[0];
      buffer[nextByte] = this.maskingKey[1];
      buffer[nextByte] = this.maskingKey[2];
      buffer[nextByte] = this.maskingKey[3];
      nextByte += 4;
    }

    this.payLoadData.copy(buffer, nextByte);

    return buffer;
  }

  unmask (buffer, mask) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  }

  static buildPing (data) {
    if (data.length > 125) {
      throw Error('Control frames (Ping) cannot have extended payloads.');
    }

    const newFrame = new Frame();
    newFrame.fin = true;
    newFrame.opCode = 0x9;
    newFrame.payloadLength = data.length;
    newFrame.payLoadData = data;

    return newFrame;
  }

  static buildPong (data) {
    if (data.length > 125) {
      throw Error('Control frames (Pong) cannot have extended payloads.');
    }

    const newFrame = new Frame();
    newFrame.fin = true;
    newFrame.opCode = 0xA;
    newFrame.payloadLength = data.length;
    newFrame.payLoadData = data;

    return newFrame;
  }
}

module.exports = { Frame, FrameOpCode };

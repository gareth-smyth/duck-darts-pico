const FrameOpCode = {
  text: 0x1
};

const ControlOpCodes = [0x8, 0x9, 0xa];

class Frame {
  constructor (data) {
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

  unmask (buffer, mask) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] ^= mask[i & 3];
    }
  }
}

module.exports = { Frame, FrameOpCode };

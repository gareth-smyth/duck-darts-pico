const EasyBitSet = require('./easy-bit-set');

class FrameBits extends EasyBitSet {
  setRsv1 (value) {
    this.setBit(1, value);
  }

  setRsv2 (value) {
    this.setBit(2, value);
  }

  setRsv3 (value) {
    this.setBit(3, value);
  }

  setFin (isFinal) {
    this.setBit(0, isFinal);
  }

  setOpCode (type) {
    this.setUInt4(4, type);
  }

  setMask (isMasked) {
    this.setBit(8, isMasked);
  }

  setMaskingKey (key, extendedPayloadBytes) {
    if (extendedPayloadBytes === 0) {
      this.setUInt32(16, key);
    } else if (extendedPayloadBytes === 1) {
      this.setUInt32(32, key);
    } else if (extendedPayloadBytes === 2) {
      this.setUInt32(80, key);
    }
  }

  getMaskingKeyByte (byteNumber, extendedPayloadBytes) {
    if (extendedPayloadBytes === 0) {
      return this.getUInt8(16 + byteNumber * 8);
    } else if (extendedPayloadBytes === 1) {
      return this.getUInt8(32 + byteNumber * 8);
    } else if (extendedPayloadBytes === 2) {
      return this.getUInt8(80 + byteNumber * 8);
    }
  }

  setPayloadLength (length, extendedPayloadBytes) {
    if (extendedPayloadBytes === 0) {
      this.setUInt7(9, length);
    } else if (extendedPayloadBytes === 1) {
      this.setUInt7(9, 126);
      this.setUInt16(16, length);
    } else if (extendedPayloadBytes === 2) {
      this.setUInt7(9, 127);
      this.setUInt64(16, length);
    }
  }

  setPayloadData (payload, isMasked, extendedPayloadBytes) {
    const payloadAsBytes = Buffer.from(payload, 'utf8');

    let startPayloadBit = 16;
    if (isMasked) {
      startPayloadBit += 32;
    }
    if (extendedPayloadBytes === 1) {
      startPayloadBit += 16;
    } else if (extendedPayloadBytes === 2) {
      startPayloadBit += 64;
    }

    for (let charStart = startPayloadBit, charByte = 0;
      charStart < startPayloadBit + payload.length * 8;
      charStart += 8, charByte++) {
      const character = payloadAsBytes[(charStart / 8) - (startPayloadBit / 8)];

      const maskedCharacter = isMasked ? character ^ this.getMaskingKeyByte(charByte & 3, extendedPayloadBytes) : character;

      this.setUInt8(charStart, maskedCharacter);
    }
  }
}

module.exports = FrameBits;

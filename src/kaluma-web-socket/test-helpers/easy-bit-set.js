class EasyBitSet {
  constructor (size = 125) {
    this.buffer = Buffer.alloc(size, 0);
  }

  setUInt4 (startBit, nibble) {
    this.setBits(startBit, 4, nibble);
  }

  setUInt8 (startBit, byte) {
    this.setBits(startBit, 8, byte);
  }

  getUInt8 (startBit) {
    return this.getBits(startBit, 8);
  }

  getUInt7 (startBit) {
    return this.getBits(startBit, 7);
  }

  setUInt64 (startBit, xLong) {
    this.setBits(startBit, 64, xLong);
  }

  setUInt32 (startBit, long) {
    this.setBits(startBit, 32, long);
  }

  setUInt16 (startBit, word) {
    this.setBits(startBit, 16, word);
  }

  setUInt7 (startBit, littleByte) {
    this.setBits(startBit, 7, littleByte);
  }

  setBit (pos, value) {
    const byte = Math.floor(pos / 8);
    const bitInByte = 7 - (pos % 8);

    if (value === 0 || value === false) {
      this.buffer[byte] = this.buffer[byte] & ~(1 << bitInByte);
    } else if (value === 1 || value === true) {
      this.buffer[byte] = this.buffer[byte] | (1 << bitInByte);
    }
  }

  getBit (pos) {
    const byte = Math.floor(pos / 8);
    const bitInByte = 7 - (pos % 8);

    return (this.buffer[byte] & (1 << bitInByte)) >> bitInByte;
  }

  setBits (startPos, numBits, value) {
    for (let bit = 0; bit < numBits; bit += 1) {
      this.setBit((startPos + numBits - 1) - bit, (value >> bit) & 0b1);
    }
  }

  getBits (startPos, numBits) {
    let value = 0;
    for (let bit = numBits - 1; bit >= 0; bit -= 1) {
      value = value << 1;
      const bitValue = this.getBit((startPos + numBits - 1) - bit);
      value = value | bitValue;
    }
    return value;
  }

  byteToBinaryString (byte) {
    return byte.toString(2).padStart(8, '0');
  }

  toString () {
    return [...this.buffer].map(this.byteToBinaryString).join(' ');
  }

  asBuffer () {
    return Buffer.from(this.buffer);
  }
}

module.exports = EasyBitSet;

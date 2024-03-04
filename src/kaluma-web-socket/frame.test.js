const { Frame, FrameOpCode } = require('./frame.js');
const FrameBits = require('./test-helpers/frame-bits');

const MASKING_KEY = 0xF1E2D3C4;
const SHORT_PAYLOAD = 'Hello';
const MEDIUM_PAYLOAD = 'A'.repeat(200);
const LARGE_PAYLOAD = 'A'.repeat(70000);

describe('validation', () => {
  it('throws if rsv1 set', () => {
    const frameBin = new FrameBits();
    frameBin.setRsv1(1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('rsv1 should not be set');
  });

  it('throws if rsv2 set', () => {
    const frameBin = new FrameBits();
    frameBin.setRsv2(1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('rsv2 should not be set');
  });

  it('throws if rsv3 set', () => {
    const frameBin = new FrameBits();
    frameBin.setRsv3(1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('rsv3 should not be set');
  });

  it('throws if reserved opcode 3 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(3);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 3 is not allowed');
  });

  it('throws if reserved opcode 4 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(4);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 4 is not allowed');
  });

  it('throws if reserved opcode 5 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(5);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 5 is not allowed');
  });

  it('throws if reserved opcode 6 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(6);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 6 is not allowed');
  });

  it('throws if reserved opcode 7 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(7);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 7 is not allowed');
  });

  it('throws if reserved opcode 11 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(11);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 11 is not allowed');
  });

  it('throws if reserved opcode 12 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(12);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 12 is not allowed');
  });

  it('throws if reserved opcode 13 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(13);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 13 is not allowed');
  });

  it('throws if reserved opcode 14 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(14);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 14 is not allowed');
  });

  it('throws if reserved opcode 15 is used', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(15);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('reserved opcode 15 is not allowed');
  });

  it('throws if a close frame has is not final', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(8);
    frameBin.setFin(0);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 8 must be final');
  });

  it('throws if a close frame has a payload length greater than 125', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(8);
    frameBin.setFin(1);
    frameBin.setPayloadLength(200, 1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 8 must not have an extended payload');
  });

  it('throws if a ping frame has is not final', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(9);
    frameBin.setFin(0);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 9 must be final');
  });

  it('throws if a ping frame has a payload length greater than 125', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(9);
    frameBin.setFin(1);
    frameBin.setPayloadLength(200, 1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 9 must not have an extended payload');
  });

  it('throws if a pong frame has is not final', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(10);
    frameBin.setFin(0);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 10 must be final');
  });

  it('throws if a pong frame has a payload length greater than 125', () => {
    const frameBin = new FrameBits();
    frameBin.setOpCode(10);
    frameBin.setFin(1);
    frameBin.setPayloadLength(200, 1);

    expect(() => new Frame(frameBin.asBuffer())).toThrow('control code 10 must not have an extended payload');
  });
});

describe('normal payload', () => {
  it('builds a final unmasked text frame', () => {
    const frameBin = new FrameBits();
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(false);
    frameBin.setPayloadLength(SHORT_PAYLOAD.length, 0);
    frameBin.setPayloadData(SHORT_PAYLOAD, false, 0);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(false);
    expect(frame.payloadLength).toBe(SHORT_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(SHORT_PAYLOAD));
  });

  it('builds a final masked text frame', () => {
    const frameBin = new FrameBits();
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(true);
    frameBin.setPayloadLength(SHORT_PAYLOAD.length, 0);
    frameBin.setMaskingKey(MASKING_KEY, 0);
    frameBin.setPayloadData(SHORT_PAYLOAD, true, 0);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(true);
    expect(frame.maskingKey).toEqual([
      (MASKING_KEY >> 24) & 0xFF, (MASKING_KEY >> 16) & 0xFF, (MASKING_KEY >> 8) & 0xFF, MASKING_KEY & 0xFF]
    );
    expect(frame.payloadLength).toBe(SHORT_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(SHORT_PAYLOAD));
  });
});

describe('medium payload', () => {
  it('builds a final unmasked text frame', () => {
    const frameBin = new FrameBits(512);
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(false);
    frameBin.setPayloadLength(MEDIUM_PAYLOAD.length, 1);
    frameBin.setPayloadData(MEDIUM_PAYLOAD, 0, 1);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(false);
    expect(frame.payloadLength).toBe(126);
    expect(frame.fullPayloadLength).toBe(MEDIUM_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(MEDIUM_PAYLOAD));
  });

  it('builds a final masked text frame', () => {
    const frameBin = new FrameBits(512);
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(true);
    frameBin.setPayloadLength(MEDIUM_PAYLOAD.length, 1);
    frameBin.setMaskingKey(MASKING_KEY, 1);
    frameBin.setPayloadData(MEDIUM_PAYLOAD, true, 1);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(true);
    expect(frame.maskingKey).toEqual([
      (MASKING_KEY >> 24) & 0xFF, (MASKING_KEY >> 16) & 0xFF, (MASKING_KEY >> 8) & 0xFF, MASKING_KEY & 0xFF]
    );
    expect(frame.payloadLength).toBe(126);
    expect(frame.fullPayloadLength).toBe(MEDIUM_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(MEDIUM_PAYLOAD));
  });
});

describe('large payload', () => {
  it('builds a final unmasked text frame', () => {
    const frameBin = new FrameBits(71000);
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(false);
    frameBin.setPayloadLength(LARGE_PAYLOAD.length, 2);
    frameBin.setPayloadData(LARGE_PAYLOAD, 0, 2);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(false);
    expect(frame.payloadLength).toBe(127);
    expect(frame.fullPayloadLength).toBe(LARGE_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(LARGE_PAYLOAD));
  });

  it('builds a final masked text frame', () => {
    const frameBin = new FrameBits(71000);
    frameBin.setFin(true);
    frameBin.setOpCode(FrameOpCode.text);
    frameBin.setMask(true);
    frameBin.setPayloadLength(LARGE_PAYLOAD.length, 2);
    frameBin.setMaskingKey(MASKING_KEY, 2);
    frameBin.setPayloadData(LARGE_PAYLOAD, true, 2);

    const frame = new Frame(frameBin.asBuffer());

    expect(frame.fin).toBe(true);
    expect(frame.rsv1).toBe(false);
    expect(frame.rsv2).toBe(false);
    expect(frame.rsv3).toBe(false);
    expect(frame.opCode).toBe(FrameOpCode.text);
    expect(frame.mask).toBe(true);
    expect(frame.maskingKey).toEqual([
      (MASKING_KEY >> 24) & 0xFF, (MASKING_KEY >> 16) & 0xFF, (MASKING_KEY >> 8) & 0xFF, MASKING_KEY & 0xFF]
    );
    expect(frame.payloadLength).toBe(127);
    expect(frame.fullPayloadLength).toBe(LARGE_PAYLOAD.length);
    expect(frame.payLoadData).toEqual(Buffer.from(LARGE_PAYLOAD));
  });
});

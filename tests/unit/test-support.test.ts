import { describe, expect, it } from 'vitest';
import { containRect } from '../support/visible-image';
import { readPngInfo } from '../support/png';

const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function uint32(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

function chunk(type: string, data: number[]): number[] {
  const name = [...type].map((character) => character.charCodeAt(0));
  // The CRC is never checked: nothing is decoded.
  return [...uint32(data.length), ...name, ...data, 0, 0, 0, 0];
}

function png(width: number, height: number, colorType: number, extra: number[][] = []) {
  const ihdr = [...uint32(width), ...uint32(height), 8, colorType, 0, 0, 0];
  return new Uint8Array([
    ...signature,
    ...chunk('IHDR', ihdr),
    ...extra.flat(),
    ...chunk('IEND', []),
  ]);
}

describe('containRect', () => {
  it('fits a width-limited image and centres it vertically', () => {
    const rect = containRect(
      { x: 10, y: 20, width: 200, height: 200 },
      { width: 400, height: 200 },
    );
    expect(rect).toEqual({ x: 10, y: 70, width: 200, height: 100 });
  });

  it('fits a height-limited image and centres it horizontally', () => {
    const rect = containRect(
      { x: 10, y: 20, width: 200, height: 100 },
      { width: 100, height: 200 },
    );
    expect(rect).toEqual({ x: 85, y: 20, width: 50, height: 100 });
  });

  it('fills the box on an exact fit', () => {
    const rect = containRect({ x: 5, y: 6, width: 300, height: 150 }, { width: 600, height: 300 });
    expect(rect).toEqual({ x: 5, y: 6, width: 300, height: 150 });
  });

  it('scales a small image up to the box', () => {
    const rect = containRect({ x: 0, y: 0, width: 100, height: 100 }, { width: 10, height: 5 });
    expect(rect).toEqual({ x: 0, y: 25, width: 100, height: 50 });
  });
});

describe('readPngInfo', () => {
  it('reads width, height, colour type and the chunk list', () => {
    const info = readPngInfo(png(833, 746, 3, [chunk('PLTE', [0, 0, 0]), chunk('tRNS', [0])]));
    expect(info).toEqual({
      width: 833,
      height: 746,
      colorType: 3,
      chunks: ['IHDR', 'PLTE', 'tRNS', 'IEND'],
    });
  });

  it('reports a truecolour image without a tRNS chunk', () => {
    const info = readPngInfo(png(32, 32, 2));
    expect(info.colorType).toBe(2);
    expect(info.chunks).toEqual(['IHDR', 'IEND']);
  });

  it('throws on a bad signature', () => {
    const bytes = png(1, 1, 2);
    bytes[0] = 0x00;
    expect(() => readPngInfo(bytes)).toThrow(/signature/i);
  });

  it('throws on input shorter than a signature', () => {
    expect(() => readPngInfo(new Uint8Array([0x89, 0x50]))).toThrow();
  });
});

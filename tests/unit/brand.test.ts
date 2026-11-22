import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  brandAssets,
  isUndistortedFile,
  isUndistortedRender,
  logoCutout,
  logoHeightForWidth,
  type PlacedMark,
} from '@/config/brand';
import { readPngInfo } from '../support/png';

// Byte sizes of the two source cut-outs (plan 14.4, step 5). They are constants
// because the cut-outs are deleted later and the tests never read them.
const blueCutoutBytes = 151_058;
const whiteCutoutBytes = 150_503;

const publicDir = resolve(import.meta.dirname, '../../public');

function readAsset(src: string): Uint8Array {
  const path = resolve(publicDir, src.replace(/^\//, ''));
  expect(existsSync(path), `${src} exists`).toBe(true);
  return new Uint8Array(readFileSync(path));
}

describe('logoHeightForWidth', () => {
  it('keeps the cut-out ratio 833:746', () => {
    expect(logoHeightForWidth(833)).toBe(746);
    expect(logoHeightForWidth(362)).toBe(324);
    expect(logoHeightForWidth(560)).toBe(502);
    expect(logoHeightForWidth(160)).toBe(143);
    expect(logoHeightForWidth(30)).toBe(27);
  });
});

describe('isUndistortedFile', () => {
  it('accepts the rounded height and one pixel either side', () => {
    expect(isUndistortedFile(362, 324)).toBe(true);
    expect(isUndistortedFile(362, 323)).toBe(true);
    expect(isUndistortedFile(362, 325)).toBe(true);
  });

  it('rejects two pixels or more away', () => {
    expect(isUndistortedFile(362, 322)).toBe(false);
    expect(isUndistortedFile(362, 326)).toBe(false);
    expect(isUndistortedFile(362, 362)).toBe(false);
  });
});

describe('isUndistortedRender', () => {
  it('accepts a height within 1 CSS px of width x 746/833', () => {
    const exact = (160.9 * 746) / 833;
    expect(isUndistortedRender(160.9, exact)).toBe(true);
    expect(isUndistortedRender(160.9, exact + 1)).toBe(true);
    expect(isUndistortedRender(160.9, exact - 1)).toBe(true);
  });

  it('rejects a height more than 1 CSS px away', () => {
    const exact = (160.9 * 746) / 833;
    expect(isUndistortedRender(160.9, exact + 1.01)).toBe(false);
    expect(isUndistortedRender(160.9, exact - 1.01)).toBe(false);
  });
});

describe('brand assets', () => {
  const entries = Object.entries(brandAssets);

  it('declares the 833x746 cut-out size', () => {
    expect(logoCutout).toEqual({ width: 833, height: 746 });
  });

  it.each(entries)('%s: the PNG exists and its IHDR matches brandAssets', (_name, asset) => {
    const info = readPngInfo(readAsset(asset.src));
    expect(info.width).toBe(asset.width);
    expect(info.height).toBe(asset.height);
  });

  it.each([
    ['logoBlue', brandAssets.logoBlue],
    ['logoWhite', brandAssets.logoWhite],
  ])('%s: undistorted and indexed (colour type 3)', (_name, asset) => {
    expect(isUndistortedFile(asset.width, asset.height)).toBe(true);
    expect(readPngInfo(readAsset(asset.src)).colorType).toBe(3);
  });

  it('keeps the white variant at exactly 833x746', () => {
    const info = readPngInfo(readAsset(brandAssets.logoWhite.src));
    expect(info.width).toBe(833);
    expect(info.height).toBe(746);
  });

  it('keeps the display variants smaller than their cut-outs', () => {
    expect(readAsset(brandAssets.logoBlue.src).byteLength).toBeLessThan(blueCutoutBytes);
    expect(readAsset(brandAssets.logoWhite.src).byteLength).toBeLessThan(whiteCutoutBytes);
  });

  it.each([
    ['icon32', brandAssets.icon32],
    ['appleTouchIcon', brandAssets.appleTouchIcon],
  ])('%s: opaque RGB (colour type 2, no tRNS)', (_name, asset) => {
    const info = readPngInfo(readAsset(asset.src));
    expect(info.colorType).toBe(2);
    expect(info.chunks).not.toContain('tRNS');
  });

  it('share image: 1200x630 with no tRNS', () => {
    const info = readPngInfo(readAsset(brandAssets.share.src));
    expect(info.width).toBe(1200);
    expect(info.height).toBe(630);
    expect(info.chunks).not.toContain('tRNS');
  });

  const placed: [string, { width: number; height: number; mark: PlacedMark }][] = [
    ['icon32', brandAssets.icon32],
    ['appleTouchIcon', brandAssets.appleTouchIcon],
    ['share', brandAssets.share],
  ];

  it.each(placed)(
    '%s: the placed mark is undistorted, a downscale, and inside the canvas',
    (_name, asset) => {
      const { mark } = asset;
      expect(isUndistortedFile(mark.width, mark.height)).toBe(true);
      expect(mark.width).toBeLessThanOrEqual(logoCutout.width);
      expect(mark.height).toBeLessThanOrEqual(logoCutout.height);
      expect(mark.x).toBeGreaterThanOrEqual(0);
      expect(mark.y).toBeGreaterThanOrEqual(0);
      expect(mark.x + mark.width).toBeLessThanOrEqual(asset.width);
      expect(mark.y + mark.height).toBeLessThanOrEqual(asset.height);
    },
  );
});

/** Size of the supplied logo cut-outs; every derived mark keeps this ratio. */
export const logoCutout = { width: 833, height: 746 } as const;

/** Height of the logo for a given width, rounded to whole pixels. */
export function logoHeightForWidth(width: number): number {
  return Math.round((width * logoCutout.height) / logoCutout.width);
}

/** A file is undistorted when its height is the rounded ratio height, within 1 px. */
export function isUndistortedFile(width: number, height: number): boolean {
  return Math.abs(height - logoHeightForWidth(width)) <= 1;
}

/** A rendered logo is undistorted when its height is within 1 CSS px of the exact ratio height. */
export function isUndistortedRender(width: number, height: number): boolean {
  return Math.abs(height - (width * logoCutout.height) / logoCutout.width) <= 1;
}

/** The rectangle where the cut-out is placed inside a derived file. */
export interface PlacedMark {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const brandAssets = {
  logoBlue: { src: '/brand/logo-blue.svg', width: 362, height: 324 },
  logoWhite: { src: '/brand/logo-white.svg', width: 833, height: 746 },
  icon32: {
    src: '/brand/icon-32.png',
    width: 32,
    height: 32,
    mark: { x: 1, y: 2, width: 30, height: 27 },
  },
  appleTouchIcon: {
    src: '/brand/apple-touch-icon.png',
    width: 180,
    height: 180,
    mark: { x: 10, y: 18, width: 160, height: 143 },
  },
  share: {
    src: '/brand/share.png',
    width: 1200,
    height: 630,
    mark: { x: 320, y: 64, width: 560, height: 502 },
  },
} as const;

export interface PngInfo {
  width: number;
  height: number;
  colorType: number;
  chunks: string[];
}

const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/**
 * Reads the IHDR fields and the chunk types of a PNG. Nothing is decoded and
 * no CRC is checked (test-only, plan 14.3). Throws on a bad signature.
 */
export function readPngInfo(bytes: Uint8Array): PngInfo {
  if (bytes.length < signature.length || signature.some((byte, index) => bytes[index] !== byte)) {
    throw new Error('Not a PNG: bad signature');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunks: string[] = [];
  let width = 0;
  let height = 0;
  let colorType = 0;
  let offset = signature.length;

  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    chunks.push(type);

    if (type === 'IHDR') {
      width = view.getUint32(offset + 8);
      height = view.getUint32(offset + 12);
      colorType = view.getUint8(offset + 17);
    }

    if (type === 'IEND') {
      break;
    }

    offset += 12 + length;
  }

  if (chunks[0] !== 'IHDR') {
    throw new Error('Not a PNG: IHDR is not the first chunk');
  }

  return { width, height, colorType, chunks };
}

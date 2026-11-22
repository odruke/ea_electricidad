export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NaturalSize {
  width: number;
  height: number;
}

/**
 * The centred rectangle that `object-fit: contain` draws inside `box` for an
 * image of the given natural size (test-only, plan 14.3).
 */
export function containRect(box: Box, natural: NaturalSize): Box {
  const scale = Math.min(box.width / natural.width, box.height / natural.height);
  const width = natural.width * scale;
  const height = natural.height * scale;

  return {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height,
  };
}

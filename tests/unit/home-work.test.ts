import { describe, expect, it } from 'vitest';

import { categoryRowOrder, workCategories, workSectionId } from '@/lib/home-work';

describe('categoryRowOrder', () => {
  it('follows the owner order: ilumination, electricity, climatization', () => {
    expect([...categoryRowOrder]).toEqual(['ilumination', 'electricity', 'climatization']);
  });

  it('is a permutation of the workCategories keys', () => {
    const rowKeys = [...categoryRowOrder].sort();
    const categoryKeys = workCategories.map((category) => category.key).sort();
    expect(rowKeys).toEqual(categoryKeys);
  });
});

describe('workSectionId', () => {
  it('builds work-section-{key}', () => {
    for (const { key } of workCategories) {
      expect(workSectionId(key)).toBe(`work-section-${key}`);
    }
  });

  it('gives unique ids that differ from the heading ids work-{key}', () => {
    const ids = workCategories.map(({ key }) => workSectionId(key));
    expect(new Set(ids).size).toBe(ids.length);
    for (const { key } of workCategories) {
      expect(workSectionId(key)).not.toBe(`work-${key}`);
    }
  });
});

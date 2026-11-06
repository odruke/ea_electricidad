export type WorkCategoryKey = 'ilumination' | 'electricity' | 'climatization';

export interface WorkImage {
  src: string;
  width: number;
  height: number;
}

export interface WorkCategory {
  key: WorkCategoryKey;
  tone: 'light' | 'muted';
  stageSide: 'left' | 'right';
  images: readonly WorkImage[];
}

/**
 * The three homepage work groupings. They are presentation groups for real EA
 * photography; the canonical five service categories stay on `/services/`.
 *
 * Images are read directly from `public/homepage`. Keep the source files, names,
 * and order in sync with the folders the owner maintains.
 */
export const workCategories: readonly WorkCategory[] = [
  {
    key: 'ilumination',
    tone: 'light',
    stageSide: 'left',
    images: [
      // The first slide pair is fixed: skyscraper1 opens the one-up mobile stage,
      // and skyscraper1 + skyscraper2 open the two-up desktop stage.
      { src: '/homepage/ilumination/skyscraper1.jpg', width: 1536, height: 2048 },
      { src: '/homepage/ilumination/skyscraper2.jpg', width: 1536, height: 2048 },
      { src: '/homepage/ilumination/IMG-20261101-WA0040.jpg', width: 2048, height: 1536 },
      { src: '/homepage/ilumination/IMG-20261101-WA0060.jpg', width: 1536, height: 2048 },
      { src: '/homepage/ilumination/skyscraper3.jpg', width: 1152, height: 2048 },
      { src: '/homepage/ilumination/skyscraper4.jpg', width: 1536, height: 2048 },
    ],
  },
  {
    key: 'electricity',
    tone: 'muted',
    stageSide: 'right',
    images: [
      { src: '/homepage/electricity/IMG-20261101-WA0067.jpg', width: 2048, height: 1536 },
      { src: '/homepage/electricity/IMG-20261101-WA0057.jpg', width: 1536, height: 2048 },
      { src: '/homepage/electricity/IMG-20261101-WA0072.jpg', width: 1536, height: 2048 },
      { src: '/homepage/electricity/IMG-20261101-WA0087.jpg', width: 1152, height: 2048 },
    ],
  },
  {
    key: 'climatization',
    tone: 'light',
    stageSide: 'left',
    images: [
      { src: '/homepage/climatization/IMG-20261101-WA0001.jpg', width: 2048, height: 1152 },
      { src: '/homepage/climatization/IMG-20261101-WA0045.jpg', width: 2048, height: 1536 },
      { src: '/homepage/climatization/IMG-20261101-WA0019.jpg', width: 1152, height: 2048 },
      { src: '/homepage/climatization/IMG-20261101-WA0027.jpg', width: 1152, height: 2048 },
      { src: '/homepage/climatization/IMG-20261101-WA0084.jpg', width: 1536, height: 2048 },
    ],
  },
];

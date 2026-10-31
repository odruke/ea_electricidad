import type { Dictionary } from '@/i18n';

export const serviceKeys = [
  'newInstallations',
  'inspections',
  'repairs',
  'climate',
  'maintenance',
] as const;

export type ServiceKey = (typeof serviceKeys)[number];

export function getServiceItems(dictionary: Dictionary): Array<{
  key: ServiceKey;
  title: string;
  description: string;
}> {
  return serviceKeys.map((key) => ({ key, ...dictionary.services.items[key] }));
}

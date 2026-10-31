export const site = {
  name: 'EA electricidad y multiservicios',
  shortName: 'EA electricidad',
  phone: {
    display: '+34 668 56 32 87',
    href: 'tel:+34668563287',
  },
  whatsapp: {
    number: '34668563287',
    href: 'https://wa.me/34668563287',
  },
  email: {
    display: 'info@ea-electricidadymultiservicios.com',
    href: 'mailto:info@ea-electricidadymultiservicios.com',
  },
  hours: {
    days: 'Monday-Friday',
    opens: '08:00',
    closes: '20:00',
  },
  serviceArea: ['Calpe', 'Altea', 'Benidorm', 'Benissa', 'Teulada'],
  colors: {
    blue: '#00208f',
    yellow: '#fad951',
    white: '#ffffff',
  },
} as const;

export function whatsappUrl(message: string): string {
  return `${site.whatsapp.href}?text=${encodeURIComponent(message)}`;
}

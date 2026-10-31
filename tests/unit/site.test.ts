import { describe, expect, it } from 'vitest';

import { site, whatsappUrl } from '@/config/site';
import { dictionaries } from '@/i18n';
import { serviceKeys } from '@/lib/services';

describe('business configuration', () => {
  it('uses the approved contact details', () => {
    expect(site.phone.href).toBe('tel:+34668563287');
    expect(site.whatsapp.href).toBe('https://wa.me/34668563287');
    expect(site.email.href).toBe('mailto:info@ea-electricidadymultiservicios.com');
  });

  it('states the approved hours without 24/7 claims', () => {
    expect(site.hours.opens).toBe('08:00');
    expect(site.hours.closes).toBe('20:00');
    expect(site.hours.days).toBe('Monday-Friday');
  });

  it('lists only the confirmed service area', () => {
    expect(site.serviceArea).toEqual(['Calpe', 'Altea', 'Benidorm', 'Benissa', 'Teulada']);
  });

  it('encodes the WhatsApp message', () => {
    expect(whatsappUrl('Hola, presupuesto')).toBe(
      'https://wa.me/34668563287?text=Hola%2C%20presupuesto',
    );
  });
});

describe('service categories', () => {
  it('contains exactly the five approved categories in every locale', () => {
    expect(serviceKeys).toEqual([
      'newInstallations',
      'inspections',
      'repairs',
      'climate',
      'maintenance',
    ]);

    for (const dictionary of Object.values(dictionaries)) {
      expect(Object.keys(dictionary.services.items).sort()).toEqual([...serviceKeys].sort());
    }
  });
});

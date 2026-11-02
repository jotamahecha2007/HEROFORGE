import { findCatalogItem } from '../../data/itemsCatalog';

/**
 * Convierte el payload de una acción en un texto legible para el inspector.
 * Función pura: fácil de testear y segura de usar dentro de un reducer.
 */
export const describePayload = (type: string, payload: unknown): string => {
  if (payload === undefined) return '—';

  if (type.endsWith('/toggleEquipItem') && typeof payload === 'string') {
    return `"${findCatalogItem(payload)?.name ?? payload}"`;
  }

  if (typeof payload === 'string') return `"${payload}"`;
  if (typeof payload === 'number') return String(payload);

  try {
    return JSON.stringify(payload);
  } catch {
    return '[payload no serializable]';
  }
};

import type { Item } from '../types/game';

/**
 * Catálogo estático de la armería.
 * Se usa como estado inicial de inventorySlice y como tabla de consulta
 * para mostrar nombres legibles en el inspector de acciones.
 */
export const ITEMS_CATALOG: readonly Item[] = [
  {
    id: 'fire-sword',
    name: 'Espada de Fuego',
    icon: '🗡️',
    category: 'weapon',
    bonusStr: 5,
    bonusAgi: 0,
    bonusInt: 1,
    weight: 8,
  },
  {
    id: 'arcane-staff',
    name: 'Báculo Arcano',
    icon: '🪄',
    category: 'weapon',
    bonusStr: 0,
    bonusAgi: 0,
    bonusInt: 7,
    weight: 4,
  },
  {
    id: 'shadow-dagger',
    name: 'Daga Sombría',
    icon: '🔪',
    category: 'weapon',
    bonusStr: 1,
    bonusAgi: 4,
    bonusInt: 0,
    weight: 2,
  },
  {
    id: 'titanium-shield',
    name: 'Escudo de Titanio',
    icon: '🛡️',
    category: 'shield',
    bonusStr: 2,
    bonusAgi: 0,
    bonusInt: 0,
    weight: 18,
  },
  {
    id: 'cursed-armor',
    name: 'Armadura Maldita',
    icon: '🥋',
    category: 'armor',
    bonusStr: 3,
    bonusAgi: -3,
    bonusInt: -1,
    weight: 30,
  },
  {
    id: 'elven-boots',
    name: 'Botas Élficas',
    icon: '👢',
    category: 'boots',
    bonusStr: 0,
    bonusAgi: 5,
    bonusInt: 0,
    weight: 1,
  },
  {
    id: 'iron-helm',
    name: 'Yelmo de Hierro',
    icon: '⛑️',
    category: 'helmet',
    bonusStr: 2,
    bonusAgi: 0,
    bonusInt: 0,
    weight: 6,
  },
  {
    id: 'spell-tome',
    name: 'Tomo de Hechizos',
    icon: '📕',
    category: 'accessory',
    bonusStr: 0,
    bonusAgi: 0,
    bonusInt: 4,
    weight: 3,
  },
];

const itemsById = new Map(ITEMS_CATALOG.map((item) => [item.id, item]));

export const findCatalogItem = (id: string): Item | undefined => itemsById.get(id);

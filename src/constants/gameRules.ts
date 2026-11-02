import type { Attributes, BuildPreset } from '../types/game';

/**
 * Reglas del juego centralizadas.
 * Ningún "número mágico" vive dentro de reducers, selectores o componentes.
 */

export const INITIAL_SKILL_POINTS = 15;
export const INITIAL_BASE_STAT = 5;
export const MIN_BASE_STAT = 1;
export const MAX_HP = 100;

/** Capacidad de carga = BASE + (Fuerza total × POR_FUERZA). */
export const BASE_CARRY_CAPACITY = 10;
export const CARRY_CAPACITY_PER_STR = 2;

/** Penalizaciones por sobrecarga. */
export const OVERLOAD_POWER_MULTIPLIER = 0.7; // -30 % de poder de combate
export const OVERLOAD_SPEED_MULTIPLIER = 0.5; // -50 % de velocidad

/** Pesos de cada atributo en el poder de combate. */
export const COMBAT_POWER_WEIGHTS: Attributes = { str: 3, agi: 2, int: 3 };

/** Umbral de la barra de peso para pasar de verde a amarillo. */
export const MEDIUM_LOAD_RATIO = 0.6;

/** Umbrales de clase visual. */
export const CLASS_MIN_DOMINANT_STAT = 12;
export const HEAVY_TANK_MIN_WEIGHT = 25;

/** Umbrales de condición según el porcentaje de HP. */
export const WOUNDED_HP_RATIO = 0.6;
export const CRITICAL_HP_RATIO = 0.25;

/** Maná derivado de la Inteligencia. */
export const BASE_MANA = 20;
export const MANA_PER_INT = 5;
export const MANA_BAR_CAP = 200;

/** Combate contra el jefe. */
export const BOSS_BASE_HP = 600;
export const BOSS_HP_PER_LEVEL = 250;
export const BOSS_BASE_ATTACK = 18;
export const BOSS_ATTACK_PER_LEVEL = 4;
export const HERO_DAMAGE_FACTOR = 0.5;
export const AGI_MITIGATION_FACTOR = 0.5;
export const MIN_DAMAGE_RECEIVED = 4;

/** Cantidad de acciones visibles en el inspector. */
export const ACTION_LOG_LIMIT = 5;

/**
 * Distribución final de atributos de cada preset.
 * Invariante: cada build suma exactamente los 15 puntos base + 15 disponibles.
 */
export const BUILD_PRESETS: Record<BuildPreset, Attributes> = {
  WARRIOR: { str: 17, agi: 9, int: 4 },
  MAGE: { str: 6, agi: 6, int: 18 },
  ROGUE: { str: 7, agi: 17, int: 6 },
  TANK: { str: 20, agi: 7, int: 3 },
};

export const TOTAL_ATTRIBUTE_POOL = INITIAL_BASE_STAT * 3 + INITIAL_SKILL_POINTS;

/** Máximo teórico de un atributo base (los otros dos en el mínimo). Escala las barras de nivel. */
export const MAX_POSSIBLE_BASE_STAT = TOTAL_ATTRIBUTE_POOL - MIN_BASE_STAT * 2;

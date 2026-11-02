/**
 * Tipos del dominio del juego.
 * Se mantienen separados del store para que la UI y la lógica de estado
 * compartan un mismo "idioma" sin depender una de la otra.
 */

/** Atributos base entrenables del héroe. */
export type StatKey = 'str' | 'agi' | 'int';

/** Presets de build que reasignan los 15 puntos en un solo dispatch. */
export type BuildPreset = 'WARRIOR' | 'MAGE' | 'ROGUE' | 'TANK';

export type ItemCategory = 'weapon' | 'shield' | 'armor' | 'boots' | 'helmet' | 'accessory';

/** Ítem del catálogo de la armería. Datos estáticos: no contienen valores calculados. */
export interface Item {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  bonusStr: number;
  bonusAgi: number;
  bonusInt: number;
  /** Peso en kilogramos. */
  weight: number;
}

export interface Attributes {
  str: number;
  agi: number;
  int: number;
}

/** Nivel de carga usado para colorear la barra de peso. */
export type LoadLevel = 'light' | 'medium' | 'overloaded';

/** Condición física del héroe según su HP (cambia la expresión del avatar). */
export type HeroCondition = 'healthy' | 'wounded' | 'critical' | 'defeated';

export type HeroClassId = 'VILLAGER' | 'BERSERKER' | 'ARCHMAGE' | 'ASSASSIN' | 'HEAVY_TANK';

/** Clase derivada del héroe. Solo datos: el color y el dibujo los decide la UI. */
export interface HeroVisualClass {
  id: HeroClassId;
  label: string;
}

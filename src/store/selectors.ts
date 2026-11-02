import { createSelector } from '@reduxjs/toolkit';

import {
  AGI_MITIGATION_FACTOR,
  BASE_CARRY_CAPACITY,
  BASE_MANA,
  BOSS_ATTACK_PER_LEVEL,
  BOSS_BASE_ATTACK,
  BOSS_BASE_HP,
  BOSS_HP_PER_LEVEL,
  CARRY_CAPACITY_PER_STR,
  CLASS_MIN_DOMINANT_STAT,
  COMBAT_POWER_WEIGHTS,
  CRITICAL_HP_RATIO,
  HEAVY_TANK_MIN_WEIGHT,
  MANA_PER_INT,
  MAX_HP,
  MEDIUM_LOAD_RATIO,
  OVERLOAD_POWER_MULTIPLIER,
  OVERLOAD_SPEED_MULTIPLIER,
  WOUNDED_HP_RATIO,
} from '../constants/gameRules';
import type { Attributes, HeroCondition, HeroVisualClass, LoadLevel } from '../types/game';
import type { RootState } from './index';

/* ──────────────────────────────────────────────────────────────
 * REGLA DE ORO: nada de lo que se calcula aquí se guarda en el state.
 * createSelector memoiza: solo recalcula cuando cambian sus entradas,
 * y devuelve la MISMA referencia si nada cambió (evita re-renders).
 * ────────────────────────────────────────────────────────────── */

/* ---------- Selectores de entrada (lectura directa) ---------- */
export const selectAvailablePoints = (state: RootState) => state.stats.availablePoints;
export const selectCurrentHp = (state: RootState) => state.stats.currentHp;
// Selectores atómicos: así el daño (currentHp) no invalida los cálculos de atributos.
export const selectBaseStr = (state: RootState) => state.stats.str;
export const selectBaseAgi = (state: RootState) => state.stats.agi;
export const selectBaseInt = (state: RootState) => state.stats.int;
export const selectCatalog = (state: RootState) => state.inventory.catalog;
export const selectEquippedIds = (state: RootState) => state.inventory.equippedIds;
export const selectCombat = (state: RootState) => state.combat;
export const selectActionLog = (state: RootState) => state.actionLog;

/* ---------- Inventario ---------- */
export const selectEquippedItems = createSelector([selectCatalog, selectEquippedIds], (catalog, equippedIds) =>
  catalog.filter((item) => equippedIds.includes(item.id)),
);

export const selectEquipmentBonuses = createSelector([selectEquippedItems], (items): Attributes =>
  items.reduce<Attributes>(
    (acc, item) => ({
      str: acc.str + item.bonusStr,
      agi: acc.agi + item.bonusAgi,
      int: acc.int + item.bonusInt,
    }),
    { str: 0, agi: 0, int: 0 },
  ),
);

/** Arma en mano: la primera de categoría 'weapon' equipada (o null). */
export const selectEquippedWeapon = createSelector(
  [selectEquippedItems],
  (items) => items.find((item) => item.category === 'weapon') ?? null,
);

/* ---------- Estadísticas totales (cruza stats + inventory) ---------- */
export const selectTotalStats = createSelector(
  [selectBaseStr, selectBaseAgi, selectBaseInt, selectEquipmentBonuses],
  (str, agi, int, bonus): Attributes => ({
    // Un ítem maldito puede restar, pero un total nunca es negativo.
    str: Math.max(0, str + bonus.str),
    agi: Math.max(0, agi + bonus.agi),
    int: Math.max(0, int + bonus.int),
  }),
);

/* ---------- Peso y sobrecarga ---------- */
export const selectTotalWeight = createSelector([selectEquippedItems], (items) =>
  items.reduce((acc, item) => acc + item.weight, 0),
);

export const selectMaxWeightCapacity = createSelector(
  [selectTotalStats],
  (total) => BASE_CARRY_CAPACITY + total.str * CARRY_CAPACITY_PER_STR,
);

export const selectIsOverencumbered = createSelector(
  [selectTotalWeight, selectMaxWeightCapacity],
  (weight, capacity) => weight > capacity,
);

export const selectLoadLevel = createSelector(
  [selectTotalWeight, selectMaxWeightCapacity],
  (weight, capacity): LoadLevel => {
    if (weight > capacity) return 'overloaded';
    return weight / capacity >= MEDIUM_LOAD_RATIO ? 'medium' : 'light';
  },
);

/* ---------- Combate ---------- */
export const selectCombatPower = createSelector([selectTotalStats, selectIsOverencumbered], (total, isOverloaded) => {
  const rawPower =
    total.str * COMBAT_POWER_WEIGHTS.str + total.agi * COMBAT_POWER_WEIGHTS.agi + total.int * COMBAT_POWER_WEIGHTS.int;
  return isOverloaded ? Math.round(rawPower * OVERLOAD_POWER_MULTIPLIER) : rawPower;
});

export const selectSpeed = createSelector([selectTotalStats, selectIsOverencumbered], (total, isOverloaded) =>
  isOverloaded ? Math.round(total.agi * OVERLOAD_SPEED_MULTIPLIER) : total.agi,
);

export const selectMaxMana = createSelector([selectTotalStats], (total) => BASE_MANA + total.int * MANA_PER_INT);

/* ---------- Estado vital ---------- */
export const selectHpRatio = (state: RootState) => selectCurrentHp(state) / MAX_HP;

export const selectHeroCondition = (state: RootState): HeroCondition => {
  const ratio = selectHpRatio(state);
  if (ratio <= 0) return 'defeated';
  if (ratio <= CRITICAL_HP_RATIO) return 'critical';
  if (ratio <= WOUNDED_HP_RATIO) return 'wounded';
  return 'healthy';
};

/* ---------- Clase visual ---------- */
const HERO_CLASSES = {
  VILLAGER: { id: 'VILLAGER', label: 'Aldeano' },
  BERSERKER: { id: 'BERSERKER', label: 'Guerrero Berserker' },
  ARCHMAGE: { id: 'ARCHMAGE', label: 'Archimago' },
  ASSASSIN: { id: 'ASSASSIN', label: 'Asesino Sombrío' },
  HEAVY_TANK: { id: 'HEAVY_TANK', label: 'Tanque Pesado' },
} as const satisfies Record<string, HeroVisualClass>;

/**
 * Determina la clase según la estadística dominante (desempate STR > INT > AGI).
 * Un héroe de Fuerza que carga mucho peso se convierte en Tanque Pesado.
 */
export const selectHeroVisualClass = createSelector(
  [selectTotalStats, selectTotalWeight],
  (total, weight): HeroVisualClass => {
    const dominantValue = Math.max(total.str, total.agi, total.int);
    if (dominantValue < CLASS_MIN_DOMINANT_STAT) return HERO_CLASSES.VILLAGER;

    if (total.str === dominantValue) {
      return weight >= HEAVY_TANK_MIN_WEIGHT ? HERO_CLASSES.HEAVY_TANK : HERO_CLASSES.BERSERKER;
    }
    if (total.int === dominantValue) return HERO_CLASSES.ARCHMAGE;
    return HERO_CLASSES.ASSASSIN;
  },
);

/* ---------- Jefe ---------- */
export const selectBossLevel = (state: RootState) => state.combat.bossLevel;

export const selectBossMaxHp = createSelector(
  [selectBossLevel],
  (level) => BOSS_BASE_HP + (level - 1) * BOSS_HP_PER_LEVEL,
);

export const selectBossHp = createSelector([selectBossMaxHp, selectCombat], (maxHp, combat) =>
  Math.max(0, maxHp - combat.bossDamageTaken),
);

export const selectIsBossDefeated = createSelector([selectBossHp], (hp) => hp <= 0);

export const selectBossAttack = createSelector(
  [selectBossLevel],
  (level) => BOSS_BASE_ATTACK + (level - 1) * BOSS_ATTACK_PER_LEVEL,
);

/** Daño base que el héroe recibe antes de la variación aleatoria (la Agilidad mitiga). */
export const selectIncomingDamageBase = createSelector([selectBossAttack, selectTotalStats], (attack, total) =>
  Math.max(0, attack - total.agi * AGI_MITIGATION_FACTOR),
);

export const selectCanAttack = (state: RootState) =>
  selectHeroCondition(state) !== 'defeated' && !selectIsBossDefeated(state);

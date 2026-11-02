import { HERO_DAMAGE_FACTOR, MIN_DAMAGE_RECEIVED } from '../../constants/gameRules';
import type { AppThunk } from '../index';
import { selectBossHp, selectCanAttack, selectCombatPower, selectIncomingDamageBase } from '../selectors';
import { bossDamaged } from '../slices/combatSlice';
import { takeDamage } from '../slices/statsSlice';

/** Variación de ±20 % para que cada golpe se sienta distinto. */
const roll = (base: number, random: () => number) => base * (0.8 + random() * 0.4);

/**
 * Resuelve un turno de combate.
 * La aleatoriedad vive en el thunk, NO en los reducers (que deben ser funciones puras).
 * `random` es inyectable para que las pruebas sean deterministas.
 */
export const attackBoss =
  (random: () => number = Math.random): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    if (!selectCanAttack(state)) return;

    const damageDealt = Math.max(1, Math.round(roll(selectCombatPower(state) * HERO_DAMAGE_FACTOR, random)));
    dispatch(bossDamaged(damageDealt));

    // Si el jefe cayó con este golpe, no hay contraataque.
    if (selectBossHp(getState()) <= 0) return;

    const damageReceived = Math.max(
      MIN_DAMAGE_RECEIVED,
      Math.round(roll(selectIncomingDamageBase(getState()), random)),
    );
    dispatch(takeDamage(damageReceived));
  };

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  BUILD_PRESETS,
  INITIAL_BASE_STAT,
  INITIAL_SKILL_POINTS,
  MAX_HP,
  MIN_BASE_STAT,
} from '../../constants/gameRules';
import type { BuildPreset, StatKey } from '../../types/game';

/**
 * Atributos base y estado vital del héroe.
 * Solo guarda datos "fuente": nada de totales, poder ni clases (eso es estado derivado).
 */
export interface StatsState {
  availablePoints: number;
  str: number;
  agi: number;
  int: number;
  currentHp: number;
}

export const initialStatsState: StatsState = {
  availablePoints: INITIAL_SKILL_POINTS,
  str: INITIAL_BASE_STAT,
  agi: INITIAL_BASE_STAT,
  int: INITIAL_BASE_STAT,
  currentHp: MAX_HP,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState: initialStatsState,
  reducers: {
    // Gracias a Immer "mutamos" un borrador (draft); RTK genera un nuevo objeto inmutable.
    incrementStat(state, action: PayloadAction<StatKey>) {
      if (state.availablePoints <= 0) return;
      state.availablePoints -= 1;
      state[action.payload] += 1;
    },
    decrementStat(state, action: PayloadAction<StatKey>) {
      if (state[action.payload] <= MIN_BASE_STAT) return;
      state.availablePoints += 1;
      state[action.payload] -= 1;
    },
    applyBuildPreset(state, action: PayloadAction<BuildPreset>) {
      const preset = BUILD_PRESETS[action.payload];
      state.str = preset.str;
      state.agi = preset.agi;
      state.int = preset.int;
      state.availablePoints = 0;
    },
    resetStats(state) {
      // Poción de Reseteo: devuelve los puntos, pero no cura ni mata al héroe.
      state.availablePoints = initialStatsState.availablePoints;
      state.str = initialStatsState.str;
      state.agi = initialStatsState.agi;
      state.int = initialStatsState.int;
    },
    takeDamage(state, action: PayloadAction<number>) {
      const damage = Math.max(0, action.payload);
      state.currentHp = Math.max(0, state.currentHp - damage);
    },
    healHero(state) {
      state.currentHp = MAX_HP;
    },
  },
});

export const { incrementStat, decrementStat, applyBuildPreset, resetStats, takeDamage, healHero } = statsSlice.actions;

export const statsSliceName = statsSlice.name;
export default statsSlice.reducer;

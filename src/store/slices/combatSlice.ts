import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { takeDamage } from './statsSlice';

/**
 * Estado de la arena. Solo guarda el HP actual y el nivel del jefe;
 * su HP máximo y su ataque se derivan del nivel en los selectores.
 */
export interface CombatState {
  bossLevel: number;
  /** Daño acumulado sobre el jefe del nivel actual (su HP restante es derivado). */
  bossDamageTaken: number;
  lastDamageDealt: number | null;
  lastDamageReceived: number | null;
  attacks: number;
}

export const initialCombatState: CombatState = {
  bossLevel: 1,
  bossDamageTaken: 0,
  lastDamageDealt: null,
  lastDamageReceived: null,
  attacks: 0,
};

const combatSlice = createSlice({
  name: 'combat',
  initialState: initialCombatState,
  reducers: {
    bossDamaged(state, action: PayloadAction<number>) {
      const damage = Math.max(0, action.payload);
      state.bossDamageTaken += damage;
      state.lastDamageDealt = damage;
      state.lastDamageReceived = null;
      state.attacks += 1;
    },
    summonNextBoss(state) {
      state.bossLevel += 1;
      state.bossDamageTaken = 0;
      state.lastDamageDealt = null;
      state.lastDamageReceived = null;
    },
  },
  extraReducers: (builder) => {
    // Un slice puede reaccionar a acciones de OTRO slice sin acoplar componentes.
    builder.addCase(takeDamage, (state, action) => {
      state.lastDamageReceived = action.payload;
    });
  },
});

export const { bossDamaged, summonNextBoss } = combatSlice.actions;

export const combatSliceName = combatSlice.name;
export default combatSlice.reducer;

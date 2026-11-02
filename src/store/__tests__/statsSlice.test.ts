import { BUILD_PRESETS, MAX_HP, MIN_BASE_STAT, TOTAL_ATTRIBUTE_POOL } from '../../constants/gameRules';
import type { BuildPreset } from '../../types/game';
import statsReducer, {
  applyBuildPreset,
  decrementStat,
  healHero,
  incrementStat,
  initialStatsState,
  resetStats,
  takeDamage,
} from '../slices/statsSlice';

describe('statsSlice', () => {
  it('incrementStat gasta un punto y sube el atributo', () => {
    const state = statsReducer(initialStatsState, incrementStat('str'));
    expect(state.str).toBe(6);
    expect(state.availablePoints).toBe(14);
  });

  it('incrementStat no hace nada sin puntos disponibles', () => {
    const empty = { ...initialStatsState, availablePoints: 0 };
    expect(statsReducer(empty, incrementStat('agi'))).toEqual(empty);
  });

  it('decrementStat devuelve el punto y nunca baja del mínimo', () => {
    const atMin = { ...initialStatsState, int: MIN_BASE_STAT };
    expect(statsReducer(atMin, decrementStat('int'))).toEqual(atMin);

    const state = statsReducer(initialStatsState, decrementStat('int'));
    expect(state.int).toBe(4);
    expect(state.availablePoints).toBe(16);
  });

  it('no muta el estado anterior (Immer produce un objeto nuevo)', () => {
    const before = { ...initialStatsState };
    const after = statsReducer(initialStatsState, incrementStat('str'));
    expect(initialStatsState).toEqual(before);
    expect(after).not.toBe(initialStatsState);
  });

  it.each(Object.keys(BUILD_PRESETS) as BuildPreset[])('el preset %s reparte exactamente el pool total', (preset) => {
    const state = statsReducer(initialStatsState, applyBuildPreset(preset));
    expect(state.str + state.agi + state.int + state.availablePoints).toBe(TOTAL_ATTRIBUTE_POOL);
    expect(state.availablePoints).toBe(0);
  });

  it('resetStats devuelve los puntos pero conserva el HP', () => {
    const trained = statsReducer(statsReducer(initialStatsState, applyBuildPreset('MAGE')), takeDamage(30));
    const reset = statsReducer(trained, resetStats());
    expect(reset).toEqual({ ...initialStatsState, currentHp: MAX_HP - 30 });
  });

  it('takeDamage nunca deja HP negativo y healHero lo restaura', () => {
    const dead = statsReducer(initialStatsState, takeDamage(999));
    expect(dead.currentHp).toBe(0);
    expect(statsReducer(dead, healHero()).currentHp).toBe(MAX_HP);
  });
});

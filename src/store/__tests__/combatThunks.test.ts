import { MAX_HP } from '../../constants/gameRules';
import { setupStore } from '../index';
import { selectBossHp, selectBossMaxHp, selectIsBossDefeated } from '../selectors';
import { summonNextBoss } from '../slices/combatSlice';
import { attackBoss } from '../thunks/combatThunks';

/** RNG fijo = 0.5 → multiplicador exacto de 1.0 (sin variación). */
const fixedRandom = () => 0.5;

describe('attackBoss (thunk)', () => {
  it('daña al jefe según el poder de combate y el héroe recibe contraataque', () => {
    const store = setupStore();
    store.dispatch(attackBoss(fixedRandom));

    const state = store.getState();
    // Poder base 40 × 0.5 = 20 de daño
    expect(selectBossHp(state)).toBe(selectBossMaxHp(state) - 20);
    // Ataque 18 − AGI 5 × 0.5 = 15.5 → 16
    expect(state.stats.currentHp).toBe(MAX_HP - 16);
    expect(state.combat).toMatchObject({ lastDamageDealt: 20, lastDamageReceived: 16, attacks: 1 });
  });

  it('no permite atacar con el héroe derrotado', () => {
    const store = setupStore({ stats: { availablePoints: 15, str: 5, agi: 5, int: 5, currentHp: 0 } });
    store.dispatch(attackBoss(fixedRandom));
    expect(store.getState().combat.attacks).toBe(0);
  });

  it('el jefe no contraataca si cae con el golpe, y el siguiente tiene más vida', () => {
    const store = setupStore({
      combat: { bossLevel: 1, bossDamageTaken: 595, lastDamageDealt: null, lastDamageReceived: null, attacks: 0 },
    });
    store.dispatch(attackBoss(fixedRandom));
    expect(selectIsBossDefeated(store.getState())).toBe(true);
    expect(store.getState().stats.currentHp).toBe(MAX_HP);

    const previousMax = selectBossMaxHp(store.getState());
    store.dispatch(summonNextBoss());
    expect(selectBossMaxHp(store.getState())).toBeGreaterThan(previousMax);
    expect(selectIsBossDefeated(store.getState())).toBe(false);
  });
});

import { setupStore } from '../index';
import {
  selectCombatPower,
  selectHeroCondition,
  selectHeroVisualClass,
  selectIsOverencumbered,
  selectLoadLevel,
  selectMaxWeightCapacity,
  selectTotalStats,
  selectTotalWeight,
} from '../selectors';
import { toggleEquipItem } from '../slices/inventorySlice';
import { applyBuildPreset, takeDamage } from '../slices/statsSlice';

const equip = (store: ReturnType<typeof setupStore>, ...ids: string[]) =>
  ids.forEach((id) => store.dispatch(toggleEquipItem(id)));

describe('selectores derivados', () => {
  it('selectTotalStats suma atributos base + bonos de ítems', () => {
    const store = setupStore();
    equip(store, 'fire-sword', 'elven-boots'); // +5 STR +1 INT, +5 AGI
    expect(selectTotalStats(store.getState())).toEqual({ str: 10, agi: 10, int: 6 });
  });

  it('un total nunca baja de 0 aunque un ítem reste', () => {
    const store = setupStore({
      stats: { availablePoints: 0, str: 1, agi: 1, int: 1, currentHp: 100 },
    });
    equip(store, 'cursed-armor'); // -3 AGI
    expect(selectTotalStats(store.getState()).agi).toBe(0);
  });

  it('capacidad = 10 + STR total × 2 y sobrecarga cuando el peso la supera', () => {
    const store = setupStore();
    equip(store, 'titanium-shield', 'fire-sword');
    // STR = 5 + 2 + 5 = 12 → capacidad 34; peso 26
    expect(selectMaxWeightCapacity(store.getState())).toBe(34);
    expect(selectTotalWeight(store.getState())).toBe(26);
    expect(selectIsOverencumbered(store.getState())).toBe(false);
    expect(selectLoadLevel(store.getState())).toBe('medium');

    equip(store, 'cursed-armor'); // STR 15 → capacidad 40; peso 56
    expect(selectIsOverencumbered(store.getState())).toBe(true);
    expect(selectLoadLevel(store.getState())).toBe('overloaded');
  });

  it('selectCombatPower aplica -30% al estar sobrecargado', () => {
    const store = setupStore();
    expect(selectCombatPower(store.getState())).toBe(5 * 3 + 5 * 2 + 5 * 3);

    equip(store, 'titanium-shield', 'fire-sword', 'cursed-armor');
    const { str, agi, int } = selectTotalStats(store.getState());
    const raw = str * 3 + agi * 2 + int * 3;
    expect(selectCombatPower(store.getState())).toBe(Math.round(raw * 0.7));
  });

  it('selectHeroVisualClass cambia con un solo dispatch de preset', () => {
    const store = setupStore();
    expect(selectHeroVisualClass(store.getState()).label).toBe('Aldeano');

    store.dispatch(applyBuildPreset('MAGE'));
    expect(selectHeroVisualClass(store.getState()).label).toBe('Archimago');

    store.dispatch(applyBuildPreset('ROGUE'));
    expect(selectHeroVisualClass(store.getState()).label).toBe('Asesino Sombrío');

    store.dispatch(applyBuildPreset('WARRIOR'));
    expect(selectHeroVisualClass(store.getState()).label).toBe('Guerrero Berserker');

    equip(store, 'cursed-armor');
    expect(selectHeroVisualClass(store.getState()).label).toBe('Tanque Pesado');
  });

  it('memoiza: misma referencia si el estado relevante no cambió', () => {
    const store = setupStore();
    const first = selectTotalStats(store.getState());
    store.dispatch(takeDamage(10)); // cambia el HP, no los atributos
    expect(selectTotalStats(store.getState())).toBe(first);
  });

  it('selectHeroCondition refleja el HP', () => {
    const store = setupStore();
    expect(selectHeroCondition(store.getState())).toBe('healthy');
    store.dispatch(takeDamage(50));
    expect(selectHeroCondition(store.getState())).toBe('wounded');
    store.dispatch(takeDamage(30));
    expect(selectHeroCondition(store.getState())).toBe('critical');
    store.dispatch(takeDamage(30));
    expect(selectHeroCondition(store.getState())).toBe('defeated');
  });
});

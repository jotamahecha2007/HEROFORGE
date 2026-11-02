import { ACTION_LOG_LIMIT } from '../../constants/gameRules';
import { setupStore } from '../index';
import { clearEquipment, toggleEquipItem } from '../slices/inventorySlice';
import { incrementStat } from '../slices/statsSlice';

describe('inventorySlice', () => {
  it('toggleEquipItem equipa y luego desequipa', () => {
    const store = setupStore();
    store.dispatch(toggleEquipItem('fire-sword'));
    expect(store.getState().inventory.equippedIds).toEqual(['fire-sword']);
    store.dispatch(toggleEquipItem('fire-sword'));
    expect(store.getState().inventory.equippedIds).toEqual([]);
  });

  it('ignora IDs que no existen en el catálogo', () => {
    const store = setupStore();
    store.dispatch(toggleEquipItem('item-fantasma'));
    expect(store.getState().inventory.equippedIds).toEqual([]);
  });

  it('clearEquipment vacía todo de golpe', () => {
    const store = setupStore();
    store.dispatch(toggleEquipItem('fire-sword'));
    store.dispatch(toggleEquipItem('elven-boots'));
    store.dispatch(clearEquipment());
    expect(store.getState().inventory.equippedIds).toEqual([]);
  });
});

describe('actionLogSlice (extraReducers + addMatcher)', () => {
  it('registra automáticamente acciones de otros slices con payload legible', () => {
    const store = setupStore();
    store.dispatch(toggleEquipItem('fire-sword'));

    const [latest] = store.getState().actionLog.entries;
    expect(latest).toMatchObject({
      seq: 1,
      type: 'inventory/toggleEquipItem',
      slice: 'inventory',
      payloadText: '"Espada de Fuego"',
    });
  });

  it(`conserva solo las últimas ${ACTION_LOG_LIMIT} acciones, la más reciente primero`, () => {
    const store = setupStore();
    for (let i = 0; i < 8; i += 1) store.dispatch(incrementStat('str'));

    const { entries, totalDispatched } = store.getState().actionLog;
    expect(entries).toHaveLength(ACTION_LOG_LIMIT);
    expect(totalDispatched).toBe(8);
    expect(entries[0].seq).toBe(8);
  });

  it('ignora acciones que no pertenecen a los slices rastreados', () => {
    const store = setupStore();
    store.dispatch({ type: 'otro/accion' });
    expect(store.getState().actionLog.totalDispatched).toBe(0);
  });
});

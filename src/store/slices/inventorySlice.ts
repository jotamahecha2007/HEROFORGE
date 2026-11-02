import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { ITEMS_CATALOG } from '../../data/itemsCatalog';
import type { Item } from '../../types/game';

/**
 * Armería y equipamiento.
 * Guarda el catálogo y SOLO los IDs equipados (normalización): el peso total,
 * los bonos y la sobrecarga se calculan en selectores.
 */
export interface InventoryState {
  catalog: Item[];
  equippedIds: string[];
}

export const initialInventoryState: InventoryState = {
  catalog: [...ITEMS_CATALOG],
  equippedIds: [],
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: initialInventoryState,
  reducers: {
    toggleEquipItem(state, action: PayloadAction<string>) {
      const itemId = action.payload;
      const exists = state.catalog.some((item) => item.id === itemId);
      if (!exists) return; // Se ignoran IDs desconocidos: el estado nunca queda inconsistente.

      const index = state.equippedIds.indexOf(itemId);
      if (index >= 0) {
        state.equippedIds.splice(index, 1);
      } else {
        state.equippedIds.push(itemId);
      }
    },
    clearEquipment(state) {
      state.equippedIds = [];
    },
  },
});

export const { toggleEquipItem, clearEquipment } = inventorySlice.actions;

export const inventorySliceName = inventorySlice.name;
export default inventorySlice.reducer;

import { createSlice, type UnknownAction } from '@reduxjs/toolkit';

import { ACTION_LOG_LIMIT } from '../../constants/gameRules';
import { describePayload } from '../utils/describeAction';
import { combatSliceName } from './combatSlice';
import { inventorySliceName } from './inventorySlice';
import { statsSliceName } from './statsSlice';

/**
 * "Monitor visual" de Redux.
 * No tiene reducers propios que la UI deba despachar: se alimenta solo,
 * escuchando las acciones de los demás slices con builder.addMatcher.
 */
export interface ActionLogEntry {
  /** Número secuencial: identifica la entrada sin usar Date.now() (los reducers deben ser puros). */
  seq: number;
  type: string;
  slice: string;
  payloadText: string;
}

export interface ActionLogState {
  entries: ActionLogEntry[];
  totalDispatched: number;
}

export const initialActionLogState: ActionLogState = {
  entries: [],
  totalDispatched: 0,
};

const TRACKED_SLICES = [statsSliceName, inventorySliceName, combatSliceName];

/** Type guard: ¿la acción pertenece a un slice que queremos registrar? */
const isTrackedAction = (action: UnknownAction): action is UnknownAction & { payload?: unknown } =>
  TRACKED_SLICES.some((slice) => action.type.startsWith(`${slice}/`));

const actionLogSlice = createSlice({
  name: 'actionLog',
  initialState: initialActionLogState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isTrackedAction, (state, action) => {
      state.totalDispatched += 1;
      state.entries.unshift({
        seq: state.totalDispatched,
        type: action.type,
        slice: action.type.split('/')[0],
        payloadText: describePayload(action.type, action.payload),
      });
      // Se conservan solo las últimas N acciones para no crecer sin límite.
      if (state.entries.length > ACTION_LOG_LIMIT) {
        state.entries.length = ACTION_LOG_LIMIT;
      }
    });
  },
});

export default actionLogSlice.reducer;

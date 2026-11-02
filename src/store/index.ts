import { combineReducers, configureStore, type ThunkAction, type UnknownAction } from '@reduxjs/toolkit';

import actionLogReducer from './slices/actionLogSlice';
import combatReducer from './slices/combatSlice';
import inventoryReducer from './slices/inventorySlice';
import statsReducer from './slices/statsSlice';

/** Reducer raíz: cada clave es una "rebanada" (slice) independiente del estado global. */
const rootReducer = combineReducers({
  stats: statsReducer,
  inventory: inventoryReducer,
  combat: combatReducer,
  actionLog: actionLogReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Fábrica del store. Permite crear stores aislados con estado precargado
 * (patrón recomendado por Redux para pruebas).
 */
export const setupStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    // configureStore ya incluye redux-thunk, Redux DevTools y, en desarrollo,
    // los middlewares que detectan mutaciones y valores no serializables.
  });

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, UnknownAction>;

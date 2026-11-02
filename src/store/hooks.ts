import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './index';

/**
 * Hooks tipados. Los componentes usan SIEMPRE estos en lugar de
 * useDispatch/useSelector "crudos", así TypeScript conoce la forma del estado.
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

import { fireEvent, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { setupStore } from '../../store';
import { GameScreen } from '../GameScreen';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderGame = async () => {
  const store = setupStore();
  await render(
    <Provider store={store}>
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <GameScreen />
      </SafeAreaProvider>
    </Provider>,
  );
  return store;
};

/**
 * Prueba de integración del "efecto dominó": un toque en una zona
 * actualiza otras zonas hermanas que no comparten props.
 */
describe('GameScreen — efecto dominó entre zonas', () => {
  // Las animaciones usan temporizadores: los simulamos para que las pruebas sean rápidas y deterministas.
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('un preset (Zona B) cambia la clase del HUD (Zona A) y aparece en la consola (Zona D)', async () => {
    await renderGame();
    expect(screen.getByTestId('hero-class-badge')).toHaveTextContent('Aldeano');

    await fireEvent.press(screen.getByTestId('preset-MAGE'));

    expect(screen.getByTestId('hero-class-badge')).toHaveTextContent('Archimago');
    expect(screen.getByTestId('action-console')).toHaveTextContent(/stats\/applyBuildPreset/);
  });

  it('equipar ítems pesados (Zona C) dispara la alerta de sobrecarga y recalcula el poder (Zona A)', async () => {
    await renderGame();
    const powerBefore = Number(screen.getByTestId('combat-power').props.children);

    await fireEvent.press(screen.getByTestId('item-titanium-shield'));
    await fireEvent.press(screen.getByTestId('item-fire-sword'));
    expect(screen.queryByTestId('overload-alert')).toBeNull();

    await fireEvent.press(screen.getByTestId('item-cursed-armor'));
    expect(screen.getByTestId('overload-alert')).toBeTruthy();
    expect(screen.getByTestId('action-console')).toHaveTextContent(/Armadura Maldita/);
    expect(Number(screen.getByTestId('combat-power').props.children)).toBeGreaterThan(powerBefore);
  });
});

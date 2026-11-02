import { ZoneCard } from '../ui/ZoneCard';
import { ActionConsole } from './ActionConsole';
import { BossArena } from './BossArena';

/**
 * ZONA D — Arena de simulación + Inspector Redux en vivo.
 * Cada subcomponente se suscribe a su propio pedazo del store.
 */
export function ReduxLiveInspector() {
  return (
    <ZoneCard numeral="IV" title="Arena & Bitácora" note="zona D · inspector" tilt={0.35} tape="right">
      <BossArena />
      <ActionConsole />
    </ZoneCard>
  );
}

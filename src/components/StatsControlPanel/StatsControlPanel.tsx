import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAvailablePoints } from '../../store/selectors';
import { applyBuildPreset, resetStats } from '../../store/slices/statsSlice';
import { colors, fonts, fontSize, spacing } from '../../theme';
import type { BuildPreset, StatKey } from '../../types/game';
import { GameButton } from '../ui/GameButton';
import { ZoneCard } from '../ui/ZoneCard';
import { StatRow } from './StatRow';

const STAT_KEYS: StatKey[] = ['str', 'agi', 'int'];

const PRESET_OPTIONS: { preset: BuildPreset; label: string }[] = [
  { preset: 'WARRIOR', label: 'Guerrero' },
  { preset: 'MAGE', label: 'Mago' },
  { preset: 'ROGUE', label: 'Pícaro' },
  { preset: 'TANK', label: 'Tanque' },
];

/**
 * ZONA B — Panel de entrenamiento.
 * Solo DESPACHA acciones a statsSlice; no calcula nada de negocio.
 */
export function StatsControlPanel() {
  const dispatch = useAppDispatch();
  const availablePoints = useAppSelector(selectAvailablePoints);

  const handlePreset = useCallback((preset: BuildPreset) => dispatch(applyBuildPreset(preset)), [dispatch]);
  const handleReset = useCallback(() => dispatch(resetStats()), [dispatch]);

  return (
    <ZoneCard numeral="II" title="Entrenamiento" note="zona B · despacha" tilt={0.5} tape="right">
      <View style={styles.pointsRow} testID="available-points">
        <Text style={styles.pointsLabel}>Puntos por repartir</Text>
        <View style={styles.dottedLeader} />
        <Text style={[styles.pointsValue, availablePoints === 0 && styles.pointsSpent]}>{availablePoints}</Text>
      </View>

      {STAT_KEYS.map((key) => (
        <StatRow key={key} statKey={key} />
      ))}

      <Text style={styles.margin}>…o elige un oficio de una vez (un solo dispatch)</Text>
      <View style={styles.presetGrid}>
        {PRESET_OPTIONS.map(({ preset, label }) => (
          <GameButton
            key={preset}
            label={label}
            variant="ink"
            onPress={() => handlePreset(preset)}
            style={styles.presetButton}
            testID={`preset-${preset}`}
          />
        ))}
      </View>

      <GameButton label="Beber poción de reseteo" variant="ghost" onPress={handleReset} testID="reset-stats" />
    </ZoneCard>
  );
}

const styles = StyleSheet.create({
  pointsRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.xs },
  pointsLabel: { fontFamily: fonts.titleItalic, fontSize: fontSize.lg, color: colors.ink },
  // Línea de puntos que une la etiqueta con el número, como en un índice impreso.
  dottedLeader: {
    flex: 1,
    borderBottomWidth: 2,
    borderStyle: 'dotted',
    borderColor: colors.inkFaint,
    marginBottom: 8,
  },
  pointsValue: { fontFamily: fonts.title, fontSize: fontSize.hero, color: colors.ochre, lineHeight: fontSize.hero + 4 },
  pointsSpent: { color: colors.inkFaint },
  margin: {
    fontFamily: fonts.hand,
    fontSize: fontSize.lg,
    color: colors.inkSoft,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    transform: [{ rotate: '-1deg' }],
  },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  presetButton: { flexGrow: 1, flexBasis: '45%' },
});

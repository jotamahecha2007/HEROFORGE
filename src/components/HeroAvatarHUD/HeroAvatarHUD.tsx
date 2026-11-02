import { StyleSheet, Text, View } from 'react-native';

import { MANA_BAR_CAP, MAX_HP } from '../../constants/gameRules';
import { useAppSelector } from '../../store/hooks';
import {
  selectCombatPower,
  selectCurrentHp,
  selectEquipmentBonuses,
  selectHeroVisualClass,
  selectIsOverencumbered,
  selectLoadLevel,
  selectMaxMana,
  selectMaxWeightCapacity,
  selectSpeed,
  selectTotalStats,
  selectTotalWeight,
} from '../../store/selectors';
import { classInk, colors, fonts, fontSize, spacing, statAbbr, statInk } from '../../theme';
import type { LoadLevel, StatKey } from '../../types/game';
import { ProgressBar } from '../ui/ProgressBar';
import { ZoneCard } from '../ui/ZoneCard';
import { HeroAvatar } from './HeroAvatar';

const LOAD_INK: Record<LoadLevel, string> = {
  light: colors.verdigris,
  medium: colors.amber,
  overloaded: colors.rust,
};

const STAT_KEYS: StatKey[] = ['str', 'agi', 'int'];

/**
 * ZONA A — Solo LEE el store mediante selectores derivados.
 * No tiene botones ni recibe props: reacciona a lo que hacen las demás zonas.
 */
export function HeroAvatarHUD() {
  const currentHp = useAppSelector(selectCurrentHp);
  const heroClass = useAppSelector(selectHeroVisualClass);
  const totalStats = useAppSelector(selectTotalStats);
  const bonuses = useAppSelector(selectEquipmentBonuses);
  const weight = useAppSelector(selectTotalWeight);
  const capacity = useAppSelector(selectMaxWeightCapacity);
  const loadLevel = useAppSelector(selectLoadLevel);
  const isOverloaded = useAppSelector(selectIsOverencumbered);
  const maxMana = useAppSelector(selectMaxMana);
  const combatPower = useAppSelector(selectCombatPower);
  const speed = useAppSelector(selectSpeed);

  const ink = classInk[heroClass.id];

  return (
    <ZoneCard numeral="I" title="El Héroe" note="zona A · solo lee" tilt={-0.6}>
      <View style={styles.topRow}>
        <HeroAvatar />

        <View style={styles.info}>
          <Text style={styles.fieldLabel}>clase</Text>
          <View style={[styles.classLine, { borderBottomColor: ink }]} testID="hero-class-badge">
            <Text style={[styles.className, { color: ink }]}>{heroClass.label}</Text>
          </View>

          <View style={styles.metricsRow}>
            <View>
              <Text style={styles.fieldLabel}>poder</Text>
              <Text style={styles.metricValue} testID="combat-power">
                {combatPower}
              </Text>
            </View>
            <View>
              <Text style={styles.fieldLabel}>velocidad</Text>
              <Text style={[styles.metricValue, isOverloaded && styles.metricPenalty]}>{speed}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            {STAT_KEYS.map((key) => (
              <Text key={key} style={styles.statText}>
                <Text style={[styles.statAbbr, { color: statInk[key] }]}>{statAbbr[key]} </Text>
                {totalStats[key]}
                {bonuses[key] !== 0 && (
                  <Text style={{ color: bonuses[key] > 0 ? colors.verdigris : colors.rust }}>
                    {bonuses[key] > 0 ? ` +${bonuses[key]}` : ` ${bonuses[key]}`}
                  </Text>
                )}
              </Text>
            ))}
          </View>
        </View>
      </View>

      <ProgressBar label="Vida" value={currentHp} max={MAX_HP} color={colors.rust} testID="hp-bar" />
      <ProgressBar label="Maná" value={maxMana} max={MANA_BAR_CAP} color={colors.indigo} valueText={`${maxMana}`} />
      <ProgressBar
        label={isOverloaded ? 'Carga — ¡demasiado peso!' : 'Carga'}
        value={weight}
        max={capacity}
        color={LOAD_INK[loadLevel]}
        valueText={`${weight} / ${capacity} kg`}
        testID="weight-bar"
      />
    </ZoneCard>
  );
}

const styles = StyleSheet.create({
  topRow: { flexDirection: 'row', gap: spacing.xl, marginBottom: spacing.lg, alignItems: 'flex-start' },
  info: { flex: 1, paddingTop: 2 },
  fieldLabel: {
    fontFamily: fonts.hand,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    lineHeight: fontSize.md + 2,
  },
  classLine: { borderBottomWidth: 1.5, borderStyle: 'dashed', paddingBottom: 2, marginBottom: spacing.sm },
  className: { fontFamily: fonts.titleItalic, fontSize: fontSize.lg + 1 },
  metricsRow: { flexDirection: 'row', gap: spacing.xl, marginBottom: spacing.xs },
  metricValue: { fontFamily: fonts.title, fontSize: fontSize.xxl, color: colors.ink, lineHeight: fontSize.xxl + 4 },
  metricPenalty: { color: colors.rust, textDecorationLine: 'underline' },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.md, rowGap: 2 },
  statText: { fontFamily: fonts.monoBold, fontSize: fontSize.xs, color: colors.ink },
  statAbbr: { fontFamily: fonts.monoBold },
});

import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectBossHp,
  selectBossLevel,
  selectBossMaxHp,
  selectCanAttack,
  selectCombat,
  selectCombatPower,
  selectHeroCondition,
  selectIsBossDefeated,
} from '../../store/selectors';
import { summonNextBoss } from '../../store/slices/combatSlice';
import { healHero } from '../../store/slices/statsSlice';
import { attackBoss } from '../../store/thunks/combatThunks';
import { colors, fonts, fontSize, radius, spacing } from '../../theme';
import { GameButton } from '../ui/GameButton';
import { ProgressBar } from '../ui/ProgressBar';

interface ArenaMessageInput {
  isBossDefeated: boolean;
  isHeroDefeated: boolean;
  combatPower: number;
  lastDamageDealt: number | null;
  lastDamageReceived: number | null;
}

/** Texto del último intercambio de golpes (función pura, sin lógica de negocio). */
const getArenaMessage = ({
  isBossDefeated,
  isHeroDefeated,
  combatPower,
  lastDamageDealt,
  lastDamageReceived,
}: ArenaMessageInput): string => {
  if (isBossDefeated) return '¡El dragón ha caído! Anótalo en la bitácora.';
  if (isHeroDefeated) return 'Tu héroe yace en el suelo. Cúralo para volver a la pelea.';
  if (lastDamageDealt === null) return `Con ${combatPower} de poder… ¿te atreves?`;
  const counter = lastDamageReceived !== null ? `; el dragón te devolvió ${lastDamageReceived}` : '';
  return `Le diste ${lastDamageDealt} de daño${counter}.`;
};

export function BossArena() {
  const dispatch = useAppDispatch();
  const bossLevel = useAppSelector(selectBossLevel);
  const bossHp = useAppSelector(selectBossHp);
  const bossMaxHp = useAppSelector(selectBossMaxHp);
  const isBossDefeated = useAppSelector(selectIsBossDefeated);
  const combatPower = useAppSelector(selectCombatPower);
  const canAttack = useAppSelector(selectCanAttack);
  const heroCondition = useAppSelector(selectHeroCondition);
  const { lastDamageDealt, lastDamageReceived } = useAppSelector(selectCombat);

  const handleAttack = useCallback(() => dispatch(attackBoss()), [dispatch]);
  const handleHeal = useCallback(() => dispatch(healHero()), [dispatch]);
  const handleNextBoss = useCallback(() => dispatch(summonNextBoss()), [dispatch]);

  const isHeroDefeated = heroCondition === 'defeated';

  return (
    <View style={styles.arena}>
      <View style={styles.bossRow}>
        <View style={[styles.bossSeal, isBossDefeated && styles.bossDefeated]}>
          <Text style={styles.bossEmoji}>{isBossDefeated ? '🪦' : '🐉'}</Text>
        </View>
        <View style={styles.bossInfo}>
          <Text style={styles.bossName}>Dragón Abisal</Text>
          <Text style={styles.bossLevel}>nivel {bossLevel}</Text>
        </View>
      </View>
      <ProgressBar label="Vida del jefe" value={bossHp} max={bossMaxHp} color={colors.plum} testID="boss-hp-bar" />

      <Text style={styles.exchange} testID="combat-log">
        {getArenaMessage({ isBossDefeated, isHeroDefeated, combatPower, lastDamageDealt, lastDamageReceived })}
      </Text>

      <View style={styles.actions}>
        {isBossDefeated ? (
          <GameButton label="Invocar al siguiente" variant="ink" onPress={handleNextBoss} style={styles.flex} />
        ) : (
          <GameButton
            label={`Atacar · ${combatPower}`}
            variant="seal"
            onPress={handleAttack}
            disabled={!canAttack}
            style={styles.flex}
            testID="attack-boss"
          />
        )}
        <GameButton label="Curar" onPress={handleHeal} testID="heal-hero" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  arena: { marginBottom: spacing.lg },
  bossRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.sm },
  bossSeal: {
    width: 58,
    height: 58,
    borderRadius: radius.round,
    borderWidth: 2,
    borderColor: colors.plum,
    backgroundColor: colors.paperShade,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
  },
  bossEmoji: { fontSize: 32 },
  bossDefeated: { opacity: 0.5 },
  bossInfo: { flex: 1 },
  bossName: { fontFamily: fonts.display, fontSize: fontSize.xl, color: colors.ink },
  bossLevel: { fontFamily: fonts.hand, fontSize: fontSize.lg, color: colors.plum, marginTop: -4 },
  exchange: {
    fontFamily: fonts.titleItalic,
    fontSize: fontSize.md,
    color: colors.inkSoft,
    marginBottom: spacing.md,
  },
  actions: { flexDirection: 'row', gap: spacing.sm },
  flex: { flex: 1 },
});

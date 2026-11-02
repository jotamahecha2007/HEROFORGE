import { memo, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MAX_POSSIBLE_BASE_STAT, MIN_BASE_STAT } from '../../constants/gameRules';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectAvailablePoints } from '../../store/selectors';
import { decrementStat, incrementStat } from '../../store/slices/statsSlice';
import { colors, fonts, fontSize, radius, spacing, statAbbr, statInk } from '../../theme';
import type { StatKey } from '../../types/game';
import { GameButton } from '../ui/GameButton';

const STAT_NAMES: Record<StatKey, string> = {
  str: 'Fuerza',
  agi: 'Agilidad',
  int: 'Inteligencia',
};

const PIP_INDEXES = Array.from({ length: MAX_POSSIBLE_BASE_STAT }, (_, i) => i);

interface StatRowProps {
  statKey: StatKey;
}

/**
 * Bloque de atributo al estilo de una hoja de rol: casilla con el valor
 * y una fila de "puntitos" que se rellenan con tinta.
 * Recibe solo la CLAVE y se suscribe a su propio valor: al tocar FUE,
 * solo se re-renderiza esta fila (no las de AGI/INT).
 */
function StatRowComponent({ statKey }: StatRowProps) {
  const dispatch = useAppDispatch();
  const value = useAppSelector((state) => state.stats[statKey]);
  const availablePoints = useAppSelector(selectAvailablePoints);

  const onIncrement = useCallback(() => dispatch(incrementStat(statKey)), [dispatch, statKey]);
  const onDecrement = useCallback(() => dispatch(decrementStat(statKey)), [dispatch, statKey]);

  const ink = statInk[statKey];

  return (
    <View style={styles.row} accessibilityLabel={`${STAT_NAMES[statKey]}: ${value}`}>
      <View style={[styles.box, { borderColor: ink }]}>
        <Text style={[styles.abbr, { color: ink }]}>{statAbbr[statKey]}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.name}>{STAT_NAMES[statKey]}</Text>
        <View style={styles.pips}>
          {PIP_INDEXES.map((i) => (
            <View key={i} style={[styles.pip, { borderColor: ink }, i < value && { backgroundColor: ink }]} />
          ))}
        </View>
      </View>

      <View style={styles.buttons}>
        <GameButton
          label="+"
          round
          onPress={onIncrement}
          disabled={availablePoints <= 0}
          accessibilityLabel={`Aumentar ${STAT_NAMES[statKey]}`}
          testID={`increment-${statKey}`}
        />
        <GameButton
          label="−"
          round
          onPress={onDecrement}
          disabled={value <= MIN_BASE_STAT}
          accessibilityLabel={`Reducir ${STAT_NAMES[statKey]}`}
          testID={`decrement-${statKey}`}
        />
      </View>
    </View>
  );
}

export const StatRow = memo(StatRowComponent);

const PIP = 8;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.inkFaint,
  },
  box: {
    width: 54,
    height: 58,
    borderWidth: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  abbr: { fontFamily: fonts.monoBold, fontSize: 10, letterSpacing: 1 },
  value: { fontFamily: fonts.title, fontSize: fontSize.xl + 2, color: colors.ink, lineHeight: fontSize.xl + 6 },
  middle: { flex: 1 },
  name: { fontFamily: fonts.titleItalic, fontSize: fontSize.md, color: colors.ink, marginBottom: 4 },
  pips: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  pip: { width: PIP, height: PIP, borderRadius: PIP / 2, borderWidth: 1 },
  buttons: { gap: spacing.sm },
});

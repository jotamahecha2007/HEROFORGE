import { memo, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { ACTION_LOG_LIMIT } from '../../constants/gameRules';
import { useAppSelector } from '../../store/hooks';
import { selectActionLog } from '../../store/selectors';
import type { ActionLogEntry } from '../../store/slices/actionLogSlice';
import { colors, fonts, fontSize, radius, sliceInk, spacing } from '../../theme';

/**
 * Bitácora del escriba: las últimas acciones despachadas (type + payload)
 * mecanografiadas sobre papel rayado.
 */
export function ActionConsole() {
  const { entries, totalDispatched } = useAppSelector(selectActionLog);

  return (
    <View style={styles.ledger} testID="action-console">
      <View style={styles.marginLine} />
      <View style={styles.header}>
        <Text style={styles.title}>redux.dispatch() · últimas {ACTION_LOG_LIMIT}</Text>
        <Text style={styles.counter}>{totalDispatched} en total</Text>
      </View>

      {entries.length === 0 ? (
        <Text style={styles.empty}>Nada anotado todavía… toca cualquier control.</Text>
      ) : (
        entries.map((entry, index) => <LogRow key={entry.seq} entry={entry} isLatest={index === 0} />)
      )}
    </View>
  );
}

interface LogRowProps {
  entry: ActionLogEntry;
  isLatest: boolean;
}

const LogRow = memo(function LogRow({ entry, isLatest }: LogRowProps) {
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.row, { opacity }]}>
      <Text style={styles.seq}>{entry.seq}.</Text>
      <Text style={styles.line} numberOfLines={2}>
        <Text style={{ color: sliceInk[entry.slice] ?? colors.ink }}>[{entry.type}]</Text>
        <Text style={styles.arrow}> → </Text>
        <Text style={styles.payload}>{entry.payloadText}</Text>
      </Text>
      {isLatest && <Text style={styles.newMark}>¡nuevo!</Text>}
    </Animated.View>
  );
});

const ROW_HEIGHT = 30;

const styles = StyleSheet.create({
  ledger: {
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    borderRadius: radius.xs,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.xl + spacing.sm,
    paddingRight: spacing.sm,
    minHeight: ROW_HEIGHT * (ACTION_LOG_LIMIT + 1) + spacing.md,
  },
  // Línea roja vertical del margen, como en un cuaderno.
  marginLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: spacing.xl,
    width: 1,
    backgroundColor: 'rgba(162, 59, 40, 0.45)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    height: ROW_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
  },
  title: { fontFamily: fonts.monoBold, fontSize: fontSize.xs, color: colors.ink },
  counter: { fontFamily: fonts.hand, fontSize: fontSize.md, color: colors.inkFaint },
  empty: { fontFamily: fonts.hand, fontSize: fontSize.lg, color: colors.inkFaint, marginTop: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    minHeight: ROW_HEIGHT,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(51, 80, 124, 0.35)', // renglón azul tenue
  },
  seq: { fontFamily: fonts.mono, fontSize: fontSize.xs, color: colors.inkFaint, width: 24 },
  line: { flex: 1, fontFamily: fonts.mono, fontSize: fontSize.xs },
  arrow: { color: colors.inkFaint },
  payload: { color: colors.ink, fontFamily: fonts.monoBold },
  newMark: { fontFamily: fonts.handBold, fontSize: fontSize.md, color: colors.rust, transform: [{ rotate: '-6deg' }] },
});

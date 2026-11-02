import { memo, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSize, radius, spacing } from '../../theme';

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  /** Texto a la derecha; por defecto "valor / máximo". */
  valueText?: string;
  /** Marcas verticales como en una regla (por defecto 10 divisiones). */
  ticks?: number;
  height?: number;
  testID?: string;
}

const ANIMATION_MS = 380;

/** Barra tipo "regla de tinta": borde dibujado, divisiones y relleno animado. */
function ProgressBarComponent({
  label,
  value,
  max,
  color,
  valueText,
  ticks = 10,
  height = 12,
  testID,
}: ProgressBarProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  // useState con inicializador perezoso: el Animated.Value se crea una sola vez.
  const [progress] = useState(() => new Animated.Value(ratio));

  useEffect(() => {
    Animated.timing(progress, {
      toValue: ratio,
      duration: ANIMATION_MS,
      useNativeDriver: false, // 'width' no es animable con el driver nativo
    }).start();
  }, [progress, ratio]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View
      style={styles.container}
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}
    >
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>{valueText ?? `${value} / ${max}`}</Text>
      </View>
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { width, backgroundColor: color }]} />
        <View style={styles.ticks} pointerEvents="none">
          {Array.from({ length: ticks - 1 }, (_, i) => (
            <View key={i} style={styles.tick} />
          ))}
        </View>
      </View>
    </View>
  );
}

export const ProgressBar = memo(ProgressBarComponent);

const styles = StyleSheet.create({
  container: { marginBottom: spacing.sm + 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 },
  label: { fontFamily: fonts.display, fontSize: fontSize.sm, color: colors.inkSoft },
  value: { fontFamily: fonts.monoBold, fontSize: fontSize.xs },
  track: {
    borderWidth: 1.5,
    borderColor: colors.ink,
    borderRadius: radius.xs,
    backgroundColor: colors.paperShade,
    overflow: 'hidden',
  },
  fill: { height: '100%' },
  ticks: { ...StyleSheet.absoluteFill, flexDirection: 'row', justifyContent: 'space-evenly' },
  tick: { width: StyleSheet.hairlineWidth, height: '45%', backgroundColor: colors.ink, opacity: 0.45 },
});

import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSize, paperShadow, radius, spacing } from '../../theme';

interface ZoneCardProps {
  /** Número romano de la sección en la hoja (I, II, III, IV). */
  numeral: string;
  title: string;
  /** Nota a lápiz junto al título (p. ej. "zona A · solo lee"). */
  note?: string;
  /** Inclinación en grados: las hojas reales nunca quedan perfectamente rectas. */
  tilt?: number;
  /** Posición del trozo de cinta adhesiva. */
  tape?: 'left' | 'right';
}

/** Sección de la hoja de personaje (solo presentación, sin estado). */
export function ZoneCard({
  numeral,
  title,
  note,
  tilt = 0,
  tape = 'left',
  children,
}: PropsWithChildren<ZoneCardProps>) {
  return (
    <View style={[styles.sheet, { transform: [{ rotate: `${tilt}deg` }] }]}>
      <View style={[styles.tape, tape === 'left' ? styles.tapeLeft : styles.tapeRight]} />

      <View style={styles.header}>
        <View style={styles.numeral}>
          <Text style={styles.numeralText}>{numeral}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        {note && <Text style={styles.note}>{note}</Text>}
      </View>
      <View style={styles.rule} />
      <View style={[styles.rule, styles.ruleThin]} />

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.paper,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg + 2,
    paddingBottom: spacing.lg,
    marginBottom: spacing.xl,
    ...paperShadow,
  },
  tape: {
    position: 'absolute',
    top: -10,
    width: 74,
    height: 22,
    backgroundColor: colors.tape,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(120, 100, 60, 0.25)',
  },
  tapeLeft: { left: 18, transform: [{ rotate: '-6deg' }] },
  tapeRight: { right: 18, transform: [{ rotate: '5deg' }] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  numeral: {
    width: 30,
    height: 30,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numeralText: { fontFamily: fonts.title, fontSize: fontSize.md, color: colors.ink },
  title: { fontFamily: fonts.display, fontSize: fontSize.xl, color: colors.ink },
  note: {
    fontFamily: fonts.hand,
    fontSize: fontSize.md,
    color: colors.inkFaint,
    marginLeft: 'auto',
    transform: [{ rotate: '-2deg' }],
  },
  rule: { height: 1.5, backgroundColor: colors.ink, marginTop: spacing.sm },
  ruleThin: { height: StyleSheet.hairlineWidth, marginTop: 2, marginBottom: spacing.md },
});

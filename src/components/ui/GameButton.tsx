import { memo } from 'react';
import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, fontSize, radius, spacing } from '../../theme';

/**
 * ink   → relleno de tinta (acción principal)
 * seal  → lacre rojo (acción peligrosa: atacar)
 * plain → papel con borde de tinta
 * ghost → borde punteado, para acciones secundarias
 */
type Variant = 'ink' | 'seal' | 'plain' | 'ghost';

interface GameButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** Botón circular pequeño (los −/+ de los atributos). */
  round?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const palette: Record<Variant, { bg: string; fg: string; border: string }> = {
  ink: { bg: colors.ink, fg: colors.cream, border: colors.ink },
  seal: { bg: colors.rust, fg: colors.cream, border: '#6f2416' },
  plain: { bg: colors.paper, fg: colors.ink, border: colors.ink },
  ghost: { bg: 'transparent', fg: colors.inkSoft, border: colors.inkFaint },
};

function GameButtonComponent({
  label,
  onPress,
  variant = 'plain',
  disabled = false,
  round = false,
  accessibilityLabel,
  style,
  testID,
}: GameButtonProps) {
  const { bg, fg, border } = palette[variant];

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      hitSlop={round ? 8 : 0}
      style={({ pressed }) => [
        styles.base,
        round && styles.round,
        variant === 'ghost' && styles.dashed,
        { backgroundColor: bg, borderColor: border },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, round && styles.roundLabel, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

export const GameButton = memo(GameButtonComponent);

const styles = StyleSheet.create({
  base: {
    borderWidth: 1.5,
    // Borde inferior más grueso: el botón parece un sello con relieve.
    borderBottomWidth: 4,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  round: { width: 34, height: 34, borderRadius: radius.round, paddingVertical: 0, paddingHorizontal: 0 },
  dashed: { borderStyle: 'dashed', borderBottomWidth: 1.5 },
  // Al presionar, el "sello" se hunde: pierde el relieve y baja 3px.
  pressed: { borderBottomWidth: 1.5, transform: [{ translateY: 2.5 }] },
  disabled: { opacity: 0.35 },
  label: { fontFamily: fonts.bodyBold, fontSize: fontSize.md },
  roundLabel: { fontFamily: fonts.title, fontSize: fontSize.lg, lineHeight: fontSize.lg + 2 },
});

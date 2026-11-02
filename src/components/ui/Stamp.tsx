import { memo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, fontSize, radius } from '../../theme';

interface StampProps {
  label: string;
  color?: string;
  rotate?: number;
  style?: StyleProp<ViewStyle>;
}

/** Sello de goma: texto en versalitas con doble borde, un poco torcido. */
function StampComponent({ label, color = colors.rust, rotate = -8, style }: StampProps) {
  return (
    <View
      pointerEvents="none"
      style={[styles.outer, { borderColor: color, transform: [{ rotate: `${rotate}deg` }] }, style]}
    >
      <View style={[styles.inner, { borderColor: color }]}>
        <Text style={[styles.text, { color }]}>{label}</Text>
      </View>
    </View>
  );
}

export const Stamp = memo(StampComponent);

const styles = StyleSheet.create({
  outer: { borderWidth: 2, borderRadius: radius.sm, padding: 1.5, opacity: 0.85 },
  inner: { borderWidth: 1, borderRadius: radius.xs, paddingHorizontal: 6, paddingVertical: 1 },
  text: { fontFamily: fonts.display, fontSize: fontSize.xs, letterSpacing: 1.5 },
});

import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, fontSize, radius, spacing, statAbbr, statInk } from '../../theme';
import type { Item, StatKey } from '../../types/game';
import { Stamp } from '../ui/Stamp';

interface ItemCardProps {
  item: Item;
  isEquipped: boolean;
  onToggle: (itemId: string) => void;
  /** Inclinación propia de la tarjeta, para que la cuadrícula no se vea "de plantilla". */
  tilt: number;
}

const getBonuses = (item: Item): { key: StatKey; value: number }[] =>
  (
    [
      { key: 'str', value: item.bonusStr },
      { key: 'agi', value: item.bonusAgi },
      { key: 'int', value: item.bonusInt },
    ] as const
  ).filter((bonus) => bonus.value !== 0);

/** Ficha de objeto (presentacional). Memoizada para evitar renders innecesarios. */
function ItemCardComponent({ item, isEquipped, onToggle, tilt }: ItemCardProps) {
  return (
    <Pressable
      onPress={() => onToggle(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`${isEquipped ? 'Desequipar' : 'Equipar'} ${item.name}`}
      accessibilityState={{ selected: isEquipped }}
      testID={`item-${item.id}`}
      style={({ pressed }) => [
        styles.card,
        isEquipped ? styles.equipped : styles.stored,
        { transform: [{ rotate: `${isEquipped ? tilt * 2 : tilt}deg` }, { scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      <View style={styles.topRow}>
        <View style={[styles.iconRing, isEquipped && styles.iconRingEquipped]}>
          <Text style={styles.icon}>{item.icon}</Text>
        </View>
        {isEquipped && <Stamp label="EQUIPADO" rotate={-12} style={styles.stamp} />}
      </View>

      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.footer}>
        <View style={styles.bonuses}>
          {getBonuses(item).map(({ key, value }) => (
            <Text key={key} style={[styles.bonus, { color: value > 0 ? statInk[key] : colors.rust }]}>
              {value > 0 ? '+' : '−'}
              {Math.abs(value)} {statAbbr[key]}
            </Text>
          ))}
        </View>
        <Text style={styles.weight}>{item.weight} kg</Text>
      </View>
    </Pressable>
  );
}

export const ItemCard = memo(ItemCardComponent);

const styles = StyleSheet.create({
  card: {
    flexBasis: '46%',
    flexGrow: 1,
    borderRadius: radius.sm,
    padding: spacing.md,
    minHeight: 128,
  },
  stored: {
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.inkFaint,
  },
  equipped: {
    backgroundColor: colors.cream,
    borderWidth: 2,
    borderColor: colors.ink,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 3 },
    elevation: 3,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconRing: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    borderWidth: 1,
    borderColor: colors.inkFaint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingEquipped: { borderColor: colors.ink, borderWidth: 1.5 },
  icon: { fontSize: 24 },
  weight: { fontFamily: fonts.hand, fontSize: fontSize.lg, color: colors.inkSoft, lineHeight: fontSize.lg },
  name: { fontFamily: fonts.title, fontSize: fontSize.md + 1, color: colors.ink, marginTop: spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 2 },
  bonuses: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.sm },
  bonus: { fontFamily: fonts.monoBold, fontSize: fontSize.xs },
  stamp: { marginTop: 8, marginRight: -4 },
});

import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectCatalog, selectEquippedIds, selectIsOverencumbered } from '../../store/selectors';
import { clearEquipment, toggleEquipItem } from '../../store/slices/inventorySlice';
import { colors, fonts, fontSize, radius, spacing } from '../../theme';
import { GameButton } from '../ui/GameButton';
import { ZoneCard } from '../ui/ZoneCard';
import { ItemCard } from './ItemCard';

/** Inclinaciones fijas (no aleatorias) para que el diseño sea estable entre renders. */
const CARD_TILTS = [-0.8, 0.6, 0.4, -0.5, 0.9, -0.3, -0.7, 0.5];

/**
 * ZONA C — Armería & Mochila.
 * Despacha a inventorySlice. El actionLogSlice registra cada acción por su cuenta
 * (addMatcher), así que este componente NO necesita "avisarle" a la bitácora.
 */
export function ArmoryGrid() {
  const dispatch = useAppDispatch();
  const catalog = useAppSelector(selectCatalog);
  const equippedIds = useAppSelector(selectEquippedIds);
  const isOverloaded = useAppSelector(selectIsOverencumbered);

  // Callback estable: permite que React.memo evite re-renderizar las tarjetas que no cambian.
  const handleToggle = useCallback((itemId: string) => dispatch(toggleEquipItem(itemId)), [dispatch]);
  const handleClear = useCallback(() => dispatch(clearEquipment()), [dispatch]);

  return (
    <ZoneCard numeral="III" title="La Mochila" note="zona C · despacha" tilt={-0.4}>
      {isOverloaded && (
        <View style={styles.alert} accessibilityRole="alert" testID="overload-alert">
          <Text style={styles.alertTitle}>¡SOBRECARGADO! (-50% Velocidad)</Text>
          <Text style={styles.alertText}>
            Llevas más peso del que tu fuerza aguanta. Tu poder de combate baja un 30%.
          </Text>
        </View>
      )}

      <Text style={styles.hint}>toca un objeto para equiparlo o guardarlo</Text>

      <View style={styles.grid}>
        {catalog.map((item, index) => (
          <ItemCard
            key={item.id}
            item={item}
            isEquipped={equippedIds.includes(item.id)}
            onToggle={handleToggle}
            tilt={CARD_TILTS[index % CARD_TILTS.length]}
          />
        ))}
      </View>

      <GameButton
        label={`Vaciar las manos (${equippedIds.length})`}
        variant="ghost"
        onPress={handleClear}
        disabled={equippedIds.length === 0}
        testID="clear-equipment"
      />
    </ZoneCard>
  );
}

const styles = StyleSheet.create({
  alert: {
    borderWidth: 2,
    borderColor: colors.rust,
    borderStyle: 'dashed',
    borderRadius: radius.sm,
    backgroundColor: 'rgba(162, 59, 40, 0.08)',
    padding: spacing.md,
    marginBottom: spacing.md,
    transform: [{ rotate: '-0.8deg' }],
  },
  alertTitle: { fontFamily: fonts.display, color: colors.rust, fontSize: fontSize.md + 1 },
  alertText: { fontFamily: fonts.body, color: colors.inkSoft, fontSize: fontSize.sm, marginTop: 2 },
  hint: { fontFamily: fonts.hand, fontSize: fontSize.md, color: colors.inkFaint, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
});

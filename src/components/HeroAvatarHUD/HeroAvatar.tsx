import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { useAppSelector } from '../../store/hooks';
import {
  selectCurrentHp,
  selectEquippedWeapon,
  selectHeroCondition,
  selectHeroVisualClass,
  selectIsOverencumbered,
} from '../../store/selectors';
import { classInk, colors, fonts, fontSize, radius } from '../../theme';
import type { HeroClassId, HeroCondition } from '../../types/game';
import { Stamp } from '../ui/Stamp';

/** Dibujo de cada clase (presentación pura). */
const CLASS_PORTRAIT: Record<HeroClassId, string> = {
  VILLAGER: '🧑‍🌾',
  BERSERKER: '🪓',
  ARCHMAGE: '🧙',
  ASSASSIN: '🥷',
  HEAVY_TANK: '🛡️',
};

const CONDITION_FACE: Record<HeroCondition, string> = {
  healthy: '😄',
  wounded: '😣',
  critical: '😵',
  defeated: '💀',
};

/**
 * Retrato del héroe "pegado" a la hoja: marco de foto antigua con mancha
 * de tinta del color de la clase, expresión según HP, arma en mano y sello
 * de SOBRECARGA. Se suscribe directamente al store: no necesita props.
 */
export function HeroAvatar() {
  const heroClass = useAppSelector(selectHeroVisualClass);
  const condition = useAppSelector(selectHeroCondition);
  const currentHp = useAppSelector(selectCurrentHp);
  const weapon = useAppSelector(selectEquippedWeapon);
  const isOverloaded = useAppSelector(selectIsOverencumbered);

  const [scale] = useState(() => new Animated.Value(1));
  const [shake] = useState(() => new Animated.Value(0));
  const previousHp = useRef(currentHp);

  // "Pop" cada vez que cambia la clase visual.
  useEffect(() => {
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.12, useNativeDriver: true, speed: 40 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18 }),
    ]).start();
  }, [heroClass.id, scale]);

  // Sacudida solo cuando el HP baja (daño recibido).
  useEffect(() => {
    if (currentHp < previousHp.current) {
      Animated.sequence(
        [9, -9, 5, -5, 0].map((toValue) => Animated.timing(shake, { toValue, duration: 50, useNativeDriver: true })),
      ).start();
    }
    previousHp.current = currentHp;
  }, [currentHp, shake]);

  const isDefeated = condition === 'defeated';
  const ink = isDefeated ? colors.inkFaint : classInk[heroClass.id];

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ rotate: '-2.5deg' }, { scale }, { translateX: shake }] }]}>
      <View
        style={styles.frame}
        accessibilityLabel={`Retrato: ${heroClass.label}, estado ${condition}`}
        testID="hero-avatar"
      >
        <View style={[styles.photo, isDefeated && styles.photoFaded]}>
          {/* Mancha de tinta del color de la clase, ligeramente descentrada. */}
          <View style={[styles.inkBlot, { backgroundColor: ink }]} />
          <View style={[styles.inkBlotSmall, { backgroundColor: ink }]} />
          <Text style={styles.portrait}>{CLASS_PORTRAIT[heroClass.id]}</Text>
        </View>
        <Text style={styles.caption}>{isDefeated ? 'q.e.p.d.' : 'el héroe'}</Text>
      </View>

      <View style={styles.face}>
        <Text style={styles.faceText}>{CONDITION_FACE[condition]}</Text>
      </View>

      {weapon && (
        <View style={styles.weapon}>
          <Text style={styles.weaponText}>{weapon.icon}</Text>
        </View>
      )}

      {isOverloaded && <Stamp label="SOBRECARGA" rotate={-16} style={styles.overloadStamp} />}
    </Animated.View>
  );
}

const PHOTO = 98;

const styles = StyleSheet.create({
  wrapper: { width: PHOTO + 14 },
  frame: {
    backgroundColor: colors.cream,
    padding: 7,
    paddingBottom: 2,
    borderWidth: 1,
    borderColor: colors.paperEdge,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 0,
    shadowOffset: { width: 2, height: 3 },
    elevation: 3,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    backgroundColor: colors.paperShade,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.inkFaint,
  },
  photoFaded: { opacity: 0.45 },
  inkBlot: { position: 'absolute', width: 78, height: 70, borderRadius: 40, opacity: 0.35, top: 16, left: 8 },
  inkBlotSmall: { position: 'absolute', width: 18, height: 16, borderRadius: 9, opacity: 0.3, top: 8, right: 10 },
  portrait: { fontSize: 50 },
  caption: { fontFamily: fonts.hand, fontSize: fontSize.md, color: colors.inkSoft, textAlign: 'center' },
  face: {
    position: 'absolute',
    top: -10,
    left: -12,
    width: 34,
    height: 34,
    borderRadius: radius.round,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceText: { fontSize: fontSize.lg },
  weapon: {
    position: 'absolute',
    bottom: 18,
    right: -14,
    width: 36,
    height: 36,
    borderRadius: radius.round,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.ochre,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '12deg' }],
  },
  weaponText: { fontSize: fontSize.lg },
  overloadStamp: { position: 'absolute', top: 40, left: -6, backgroundColor: 'rgba(241, 230, 207, 0.85)' },
});

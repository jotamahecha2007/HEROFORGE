import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ArmoryGrid } from '../components/ArmoryGrid/ArmoryGrid';
import { HeroAvatarHUD } from '../components/HeroAvatarHUD/HeroAvatarHUD';
import { ReduxLiveInspector } from '../components/ReduxLiveInspector/ReduxLiveInspector';
import { StatsControlPanel } from '../components/StatsControlPanel/StatsControlPanel';
import { colors, fonts, fontSize, spacing } from '../theme';

/**
 * Pantalla principal. Las 4 zonas son HERMANAS y NO reciben props:
 * toda la comunicación entre ellas ocurre a través del store de Redux.
 */
export function GameScreen() {
  return (
    <SafeAreaView style={styles.table} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.masthead}>
          <Text style={styles.kicker}>hoja de personaje n.º 1</Text>
          <Text style={styles.title}>HeroForge</Text>
          <View style={styles.titleRule} />
          <Text style={styles.subtitle}>forjado con Redux Toolkit · un solo store, cuatro zonas</Text>
        </View>

        <HeroAvatarHUD />
        <StatsControlPanel />
        <ArmoryGrid />
        <ReduxLiveInspector />

        <Text style={styles.footer}>— fin de la hoja —</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  table: { flex: 1, backgroundColor: colors.table },
  content: {
    paddingHorizontal: spacing.lg + 2,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl * 2,
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  masthead: { marginBottom: spacing.xl + spacing.sm, alignItems: 'flex-start' },
  kicker: { fontFamily: fonts.hand, fontSize: fontSize.lg, color: colors.paperEdge, transform: [{ rotate: '-2deg' }] },
  title: { fontFamily: fonts.title, fontSize: 52, color: colors.cream, lineHeight: 58 },
  titleRule: { width: 120, height: 2, backgroundColor: colors.ochre, marginVertical: spacing.xs },
  subtitle: { fontFamily: fonts.titleItalic, fontSize: fontSize.md, color: colors.paperEdge },
  footer: { fontFamily: fonts.hand, fontSize: fontSize.lg, color: colors.inkFaint, textAlign: 'center' },
});

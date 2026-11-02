import { Caveat_600SemiBold, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { CourierPrime_400Regular, CourierPrime_700Bold } from '@expo-google-fonts/courier-prime';
import { CrimsonPro_400Regular, CrimsonPro_700Bold } from '@expo-google-fonts/crimson-pro';
import { IMFellEnglish_400Regular, IMFellEnglish_400Regular_Italic } from '@expo-google-fonts/im-fell-english';
import { IMFellEnglishSC_400Regular } from '@expo-google-fonts/im-fell-english-sc';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { GameScreen } from './src/screens/GameScreen';
import { store } from './src/store';
import { colors } from './src/theme';

/**
 * Punto de entrada: el <Provider> pone el store a disposición de TODO el árbol,
 * por eso ningún componente necesita recibir estado por props.
 */
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    IMFellEnglish_400Regular,
    IMFellEnglish_400Regular_Italic,
    IMFellEnglishSC_400Regular,
    CrimsonPro_400Regular,
    CrimsonPro_700Bold,
    Caveat_600SemiBold,
    Caveat_700Bold,
    CourierPrime_400Regular,
    CourierPrime_700Bold,
  });

  // Mientras cargan las fuentes mostramos solo la "mesa" vacía (sin parpadeo de tipografía).
  // Si fallan, seguimos igual con las fuentes del sistema.
  if (!fontsLoaded && !fontError) {
    return <View style={{ flex: 1, backgroundColor: colors.table }} />;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <GameScreen />
      </SafeAreaProvider>
    </Provider>
  );
}

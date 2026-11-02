import type { HeroClassId, StatKey } from '../types/game';

/**
 * Tokens de diseño — estética "hoja de personaje de rol de mesa":
 * papel envejecido sobre una mesa de madera, tinta sepia, sellos de lacre
 * y notas escritas a mano en los márgenes.
 */
export const colors = {
  table: '#2b211b', // la mesa sobre la que descansa la hoja
  tableLight: '#3a2d24',
  paper: '#f1e6cf',
  paperShade: '#e6d6b5',
  paperEdge: '#c9b28a',
  ink: '#2d231a',
  inkSoft: '#5b4a39',
  inkFaint: '#8c7760',
  cream: '#f6edd9',

  rust: '#a23b28', // vida, peligro, sellos
  ochre: '#b5762b', // fuerza, oro
  verdigris: '#3d7560', // agilidad, éxito
  indigo: '#33507c', // inteligencia, maná
  plum: '#6b3a5a', // el jefe
  amber: '#c48a1c', // carga media
  tape: 'rgba(222, 205, 160, 0.75)',
} as const;

export const fonts = {
  /** Títulos en versalitas de imprenta antigua. */
  display: 'IMFellEnglishSC_400Regular',
  title: 'IMFellEnglish_400Regular',
  titleItalic: 'IMFellEnglish_400Regular_Italic',
  body: 'CrimsonPro_400Regular',
  bodyBold: 'CrimsonPro_700Bold',
  /** Anotaciones "a lápiz" en los márgenes. */
  hand: 'Caveat_600SemiBold',
  handBold: 'Caveat_700Bold',
  /** Máquina de escribir para la bitácora de Redux. */
  mono: 'CourierPrime_400Regular',
  monoBold: 'CourierPrime_700Bold',
} as const;

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;

export const radius = { xs: 2, sm: 4, md: 8, round: 999 } as const;

export const fontSize = { xs: 12, sm: 14, md: 16, lg: 19, xl: 24, xxl: 34, hero: 44 } as const;

/** Sombra "dura" (sin desenfoque): da la sensación de papel apilado. */
export const paperShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.35,
  shadowRadius: 0,
  shadowOffset: { width: 3, height: 4 },
  elevation: 4,
} as const;

export const statInk: Record<StatKey, string> = {
  str: colors.ochre,
  agi: colors.verdigris,
  int: colors.indigo,
};

/** Abreviaturas en español, como en una hoja de personaje impresa. */
export const statAbbr: Record<StatKey, string> = { str: 'FUE', agi: 'AGI', int: 'INT' };

/** Color de tinta de cada clase (presentación: no vive en el store). */
export const classInk: Record<HeroClassId, string> = {
  VILLAGER: colors.inkFaint,
  BERSERKER: colors.rust,
  ARCHMAGE: colors.indigo,
  ASSASSIN: colors.verdigris,
  HEAVY_TANK: colors.ochre,
};

/** Tinta por slice en la bitácora de acciones. */
export const sliceInk: Record<string, string> = {
  stats: colors.ochre,
  inventory: colors.verdigris,
  combat: colors.plum,
};

import type { ThemeDefinition } from 'vuetify';
import {
  blue,
  blueGrey,
  cyan,
  green,
  indigo,
  orange,
  pink,
  red,
  teal,
} from 'vuetify/util/colors';

/** 可选的品牌主色 */
export const colorOptions = { indigo, blue, teal, cyan, pink, red } as const;

export type Color = keyof typeof colorOptions;
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeName = `${Color}_light` | `${Color}_dark`;

export const colorLabels: Record<Color, string> = {
  indigo: '靛蓝',
  blue: '蓝色',
  teal: '蓝绿',
  cyan: '青色',
  pink: '粉色',
  red: '红色',
};

const isColor = (value: string | null): value is Color =>
  !!value && Object.hasOwn(colorOptions, value);

const isThemeMode = (value: string | null): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

/** 浅色主题中，部分高亮主色需要深色前景以保证对比度 */
const onPrimaryLight: Record<Color, string> = {
  indigo: '#FFFFFF',
  blue: '#FFFFFF',
  teal: '#FFFFFF',
  cyan: '#062A30',
  pink: '#FFFFFF',
  red: '#FFFFFF',
};

const lightSurfaces = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  'surface-bright': '#FFFFFF',
  'surface-light': '#EFF4F8',
  'surface-variant': '#E6EDF4',
  'on-surface-variant': '#44515E',
  'on-background': '#16202A',
  'on-surface': '#16202A',
  outline: '#8593A2',
};

const darkSurfaces = {
  background: '#0C1116',
  surface: '#151C23',
  'surface-bright': '#202A34',
  'surface-light': '#1B242D',
  'surface-variant': '#26323D',
  'on-surface-variant': '#B4C1CE',
  'on-background': '#E8EFF5',
  'on-surface': '#E8EFF5',
  outline: '#7E8C99',
};

const createTheme = (color: Color, dark: boolean): ThemeDefinition => {
  const palette = colorOptions[color];

  return {
    dark,
    colors: dark
      ? {
          ...darkSurfaces,
          primary: palette.lighten1,
          'on-primary': '#0B1117',
          secondary: blueGrey.lighten1,
          'on-secondary': '#0B1117',
          info: blue.lighten1,
          'on-info': '#0B1117',
          success: green.lighten1,
          'on-success': '#0B1117',
          warning: orange.lighten1,
          'on-warning': '#241400',
          error: red.lighten1,
          'on-error': '#0B1117',
        }
      : {
          ...lightSurfaces,
          primary: palette.base,
          'on-primary': onPrimaryLight[color],
          secondary: blueGrey.darken1,
          'on-secondary': '#FFFFFF',
          info: blue.darken1,
          'on-info': '#FFFFFF',
          success: green.darken1,
          'on-success': '#FFFFFF',
          warning: orange.darken1,
          'on-warning': '#241400',
          error: red.darken1,
          'on-error': '#FFFFFF',
        },
  };
};

export const themes = Object.fromEntries(
  (Object.keys(colorOptions) as Color[]).flatMap((color) => [
    [`${color}_light`, createTheme(color, false)],
    [`${color}_dark`, createTheme(color, true)],
  ]),
) as Record<ThemeName, ThemeDefinition>;

export function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true;
  if (mode === 'light') return false;
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

export function resolveThemeName(color: Color, mode: ThemeMode): ThemeName {
  return `${color}_${resolveIsDark(mode) ? 'dark' : 'light'}`;
}

/**
 * 读取持久化的主题设置，同时兼容旧版本的 `color` / `dark` 键。
 * 在创建 Vuetify 实例前调用，避免首屏主题闪烁。
 */
export function readStoredTheme(): { color: Color; mode: ThemeMode } {
  if (typeof window === 'undefined') {
    return { color: 'indigo', mode: 'system' };
  }

  const storedColor = localStorage.getItem('theme-color');
  const legacyColor = localStorage.getItem('color');
  const color = isColor(storedColor)
    ? storedColor
    : isColor(legacyColor)
      ? legacyColor
      : 'indigo';

  const storedMode = localStorage.getItem('theme-mode');
  const legacyMode = localStorage.getItem('dark');
  const mode = isThemeMode(storedMode)
    ? storedMode
    : legacyMode === 'true'
      ? 'dark'
      : legacyMode === 'false'
        ? 'light'
        : 'system';

  return { color, mode };
}

export function getInitialThemeName(): ThemeName {
  const { color, mode } = readStoredTheme();
  return resolveThemeName(color, mode);
}

export default {
  defaultTheme: getInitialThemeName(),
  variations: {
    colors: ['primary', 'secondary', 'error', 'success', 'warning', 'info'],
    lighten: 2,
    darken: 3,
  },
  themes,
};

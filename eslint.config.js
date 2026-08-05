// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");
const jsxA11y = require('eslint-plugin-jsx-a11y');
const reactNativeA11y = require('eslint-plugin-react-native-a11y');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    // eslint-plugin-jsx-a11y: reglas de accesibilidad para JSX estilo web (HTML/ARIA).
    // Se incluye porque la actividad lo pide explícitamente, aunque sus reglas
    // (img alt, anchor href, aria-*, etc.) no aplican a elementos de React Native.
    files: ["src/components/**/*.tsx"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    // eslint-plugin-react-native-a11y: equivalente real para React Native
    // (accessibilityLabel, accessibilityRole, accessibilityState, etc.).
    files: ["src/components/**/*.tsx"],
    plugins: {
      'react-native-a11y': reactNativeA11y,
    },
    rules: reactNativeA11y.configs.all.rules,
  },
]);
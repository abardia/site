// theme.ts
import { createTheme, ThemeOptions, Shadows } from '@mui/material/styles';

// Augment the Theme interface to enforce shadows as a string array
declare module '@mui/material/styles' {
  interface Theme {
    shadows: Shadows;
  }
  interface ThemeOptions {
    shadows?: Shadows; // Optional in ThemeOptions, but required in the final Theme
  }
}



// Shorter default shadows (you can customize these)
const defaultShadows = [
  'none',
  '0px 1px 3px rgba(0,0,0,0.12)', // Lighter shadow
  '0px 2px 6px rgba(0,0,0,0.15)', // Slightly stronger
  '0px 3px 8px rgba(0,0,0,0.2)',  // More pronounced
  '0px 4px 10px rgba(0,0,0,0.25)', // Even stronger
  // ... add more if you need them, but keep it concise
];

const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#673ab7' },
    secondary: { main: '#ff9800' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: '#333', secondary: '#555' },
  },
  shadows: defaultShadows as Shadows, // Use the shorter shadows
};

const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#ba68c8' },
    secondary: { main: '#ffa726' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#eee', secondary: '#aaa' },
  },
  shadows: defaultShadows as Shadows, // Use the shorter shadows
};

export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

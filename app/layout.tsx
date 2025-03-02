'use client'

import { 
  ThemeProvider, CssBaseline 
} from '@mui/material';
import { 
  lightTheme, darkTheme 
} from './theme'; 
import { 
  useState, useEffect 
} from 'react';
import './globals.css';
import { 
  PropsWithChildren 
} from 'react';


export default function RootLayout({ 
  children 
}: PropsWithChildren) {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? darkTheme : lightTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? darkTheme : lightTheme);
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return (
    <html lang="en">
      <body>
          <ThemeProvider theme={
            theme
          }>
            <CssBaseline /> {
              children
            }
          </ThemeProvider>
      </body>
    </html>
  );
}
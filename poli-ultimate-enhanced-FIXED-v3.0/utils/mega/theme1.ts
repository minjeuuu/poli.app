export const theme1 = {
  name: 'Theme 1',
  colors: {
    primary: `hsl(${1 * 7}, 70%, 50%)`,
    secondary: `hsl(${1 * 7 + 30}, 70%, 50%)`,
    accent: `hsl(${1 * 7 + 60}, 70%, 50%)`,
    background: '#ffffff',
    text: '#000000'
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'Fira Code, monospace'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
  },
  borderRadius: '0.5rem',
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)'
  }
};

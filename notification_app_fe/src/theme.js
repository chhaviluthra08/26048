import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6C63FF' },
    secondary: { main: '#00D4AA' },
    background: {
      default: '#0A0A0F',
      paper: '#12121A',
    },
    text: {
      primary: '#F0F0FF',
      secondary: '#8888AA',
    },
    error: { main: '#FF4D6D' },
    warning: { main: '#FFB347' },
    success: { main: '#00D4AA' },
  },
  typography: {
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(108,99,255,0.15)',
        },
      },
    },
  },
});

export default theme;
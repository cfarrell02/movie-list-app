import { alpha, createTheme } from '@mui/material/styles';

const fontFamily = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',');

const buildTheme = (mode) => {
  const isDark = mode === 'dark';
  const primary = isDark ? '#8B8CF8' : '#4F46E5';
  const divider = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';

  return createTheme({
    palette: {
      mode,
      primary: { main: primary },
      secondary: { main: isDark ? '#F5B544' : '#D97706' },
      background: {
        default: isDark ? '#0E1015' : '#F5F6FA',
        paper: isDark ? '#171A22' : '#FFFFFF',
      },
      text: isDark
        ? { primary: '#ECEEF3', secondary: '#9AA1B2' }
        : { primary: '#0F172A', secondary: '#5B6475' },
      divider,
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily,
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em', fontSize: '2.75rem' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2.25rem' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em', fontSize: '1.6rem' },
      h5: { fontWeight: 700, letterSpacing: '-0.01em' },
      h6: { fontWeight: 600, fontSize: '1.05rem' },
      subtitle1: { fontWeight: 500 },
      button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { overscrollBehavior: 'none' },
          a: { color: 'inherit' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 10, paddingInline: 16 } },
      },
      MuiButtonGroup: {
        defaultProps: { disableElevation: true },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
          outlined: { borderColor: divider },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${divider}`,
            borderRadius: 16,
          },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' } },
      },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: divider },
          head: { fontWeight: 700 },
        },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 16 } },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 600 } },
      },
      MuiLink: {
        defaultProps: { underline: 'hover' },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: { backgroundColor: alpha(isDark ? '#2A2F3A' : '#0F172A', 0.95), fontSize: '0.8rem' },
        },
      },
    },
  });
};

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');

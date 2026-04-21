const baselightTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#007367',
      light: '#dff6f2',
      dark: '#007367',
    },
    secondary: {
      main: '#49BEFF',
      light: '#e6fbf8',
      dark: '#23afdb',
    },
    success: {
      main: '#13DEB9',
      light: '#E6FFFA',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#007367',
      light: '#c7f3f0ff',
      dark: '#1682d4',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FA896B',
      light: '#FDEDE8',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#FEF5E5',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#c7f3f0ff',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    grey: {
      100: '#edf8f5',
      200: '#dceae6',
      300: '#c6dad5',
      400: '#6f8d86',
      500: '#4e6f69',
      600: '#007367',
    },
    text: {
      primary: '#00655b',
      secondary: '#4b7a73',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#e7f6f2',
    },
    divider: '#cfe4df',
    background: {
      default: '#dcebe7',
      paper: '#eef7f5',
      dark: '#cfe0db',
    },
  },
};

const baseDarkTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#007367',
      light: '#d6eeea',
      dark: '#007367',
    },
    secondary: {
      main: '#777e89',
      light: '#163d4a',
      dark: '#0f2e38',
    },
    success: {
      main: '#13DEB9',
      light: '#0d2e38',
      dark: '#02b3a9',
      contrastText: '#ffffff',
    },
    info: {
      main: '#007367',
      light: '#0d2e38',
      dark: '#007367',
      contrastText: '#ffffff',
    },
    error: {
      main: '#FA896B',
      light: '#4B313D',
      dark: '#f3704d',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#FFAE1F',
      light: '#4D3A2A',
      dark: '#ae8e59',
      contrastText: '#ffffff',
    },
    purple: {
      A50: '#c7f3f0ff',
      A100: '#6610f2',
      A200: '#557fb9',
    },
    grey: {
      100: '#0d2e38',
      200: '#163d4a',
      300: '#4a8a82',
      400: '#b0d4cf',
      500: '#c8e8e3',
      600: '#ddf0ec',
      A700: '#163d4a',
    },
    text: {
      primary: '#e6f6f3',
      secondary: '#a0bdba',
    },
    action: {
      disabledBackground: 'rgba(73,82,88,0.12)',
      hoverOpacity: 0.02,
      hover: '#0d2e38',
    },
    divider: '#1a3d47',
    background: {
      default: '#0b2b34',
      dark: '#0b141a',
      paper: '#0f2530',
    },
  },
};

export { baseDarkTheme, baselightTheme };

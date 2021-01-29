import {
  ThemeOptions,
  TypographyStyle,
  Theme,
  createMuiTheme,
  colors,
} from '@material-ui/core'
import { Palette } from '@material-ui/core/styles/createPalette'
import {
  Variant,
  TypographyStyleOptions,
  FontStyleOptions,
  FontStyle,
  TypographyUtils,
} from '@material-ui/core/styles/createTypography'

type MyVariant = Variant | 'tab' | 'estimate' | 'learnMore'

interface MyTypographyOptions
  extends Partial<
    Record<MyVariant, TypographyStyleOptions> & FontStyleOptions
  > {}

interface MyThemeOptions extends ThemeOptions {
  typography?: MyTypographyOptions | ((palette: Palette) => MyTypographyOptions)
}

interface MyTypography
  extends Record<MyVariant, TypographyStyle>,
    FontStyle,
    TypographyUtils {}

export interface MyTheme extends Theme {
  typography: MyTypography
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1F434B',
    },
    secondary: colors.orange,
  },
})

export const mainTheme = createMuiTheme({
  components: {
    MuiLink: {
      styleOverrides: {
        underlineHover: {
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
  },
  palette: {
    ...theme.palette,
  },
  overrides: {},
  typography: {
    fontFamily: [
      'Raleway',
      'Langar',
      'Roboto',
      'Pacifico',
      'sans-serif',
      'cursive',
    ].join(','),
    tab: {
      textTransform: 'none',
      fontWeight: 'bold',
      fontSize: '1rem',
      fontFamily: 'Raleway',
    },
    estimate: {
      fontFamily: 'Pacifico',
      textTransform: 'none',
      fontSize: '1rem',
      color: 'white',
    },
    h4: {
      fontFamily: 'Pacifico',
      marginBottom: '1rem',
    },
    h1: {
      fontFamily: 'Raleway',
      fontSize: '2rem',
      fontWeight: 'bold',
      color: theme.palette.primary.dark,
      '& styled': {
        fontFamily: 'Pacifico',
        color: 'orange',
      },
    },
    h3: {
      fontFamily: 'Pacifico',
      color: theme.palette.secondary.light,
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body1: {
      fontFamily: 'Langar',
      fontSize: '1.05rem',
      color: 'grey',
    },
    subtitle2: {
      color: 'grey',
      fontSize: '.8rem',
      textAlign: 'center',
      '& span': {
        fontFamily: 'Pacifico',
        color: 'orange',
      },
    },
    learnMore: {
      background: 'transparent',
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: '50px',
      '&:hover': {
        color: 'white',
        background: theme.palette.primary.main,
      },
    },
  },
} as MyThemeOptions)

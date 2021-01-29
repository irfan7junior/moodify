import { colors, createStyles, Theme } from '@material-ui/core'

export const styles = (theme: Theme) =>
  createStyles({
    fullHW: {
      height: '100%',
      width: '100%',
    },
    fullH: {
      height: '100%',
    },
    fullW: {
      width: '100%',
    },
    halfH: {
      height: '50%',
    },
    halfW: {
      width: '50%',
    },
    flexDC: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    flexDR: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'nowrap',
    },
    textUB: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    marginB: {
      marginBottom: theme.spacing(1),
    },
    marginT: {
      marginTop: theme.spacing(1),
    },
    marginL: {
      marginLeft: theme.spacing(1),
    },
    marginR: {
      marginRight: theme.spacing(1),
    },
    margin: {
      margin: theme.spacing(1),
    },
    marginX: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    marginY: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    paddingB: {
      paddingBottom: theme.spacing(1),
    },
    paddingT: {
      paddingTop: theme.spacing(1),
    },
    paddingL: {
      paddingLeft: theme.spacing(1),
    },
    paddingR: {
      paddingRight: theme.spacing(1),
    },
    padding: {
      padding: theme.spacing(1),
    },
    paddingX: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    paddingY: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    pColor: {
      backgroundColor: theme.palette.primary.main,
    },
    sColor: {
      backgroundColor: theme.palette.secondary.main,
    },
    gColor: {
      backgroundColor: colors.grey[200],
    },
    absCenter: {
      position: 'absolute',
      marginLeft: 'auto',
      marginRight: 'auto',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    scrollBar: {
      '&::-webkit-scrollbar': {
        width: '0.4em',
      },
      '&::-webkit-scrollbar-track': {
        '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.3)',
        backgroundColor: '#F5F5F5',
        borderRadius: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(0,0,0,.1)',
        outline: '0px solid slategrey',
      },
    },
    textCenter: {
      textAlign: 'center',
    },
    center: {
      margin: '0 auto',
    },
  })

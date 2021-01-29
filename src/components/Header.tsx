import React, { useState } from 'react'
import {
  makeStyles,
  withStyles,
  WithStyles,
  AppBar,
  Toolbar,
  useScrollTrigger,
  Button,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
} from '@material-ui/core'
import { styles } from 'src/styles/global'
// import clsx from 'clsx'
import { MyTheme } from 'src/styles/material-ui'
import Link from 'src/Link'
import { Menu as MenuIcon } from '@material-ui/icons'

interface Props {
  window?: () => Window
  children: React.ReactElement
}

function ElevationScroll(props: Props) {
  const { children } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

export interface IHeader {}

const Header: React.FC<IHeader & WithStyles<typeof styles>> = ({ classes }) => {
  const css = useStyles()

  const [openDrawer, setOpenDrawer] = useState(false)

  const iOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent)
  const theme = useTheme<MyTheme>()
  const matches = useMediaQuery(theme.breakpoints.down('lg'))

  const drawer = (
    <>
      <SwipeableDrawer
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        open={openDrawer}
        onOpen={() => setOpenDrawer(true)}
        onClose={() => setOpenDrawer(false)}
        classes={{ paper: css.drawer }}
      >
        <List disablePadding dense style={{ marginTop: '6rem' }}>
          <ListItem
            button
            aria-label="icon-button"
            component={Link}
            href="https://irfan7junior.in/resume"
            onClick={() => {
              setOpenDrawer(false)
            }}
            divider
            style={{ opacity: '1' }}
            className={css.listItem}
          >
            <ListItemText disableTypography classes={{ root: classes.flexDR }}>
              Resume
            </ListItemText>
          </ListItem>
          <ListItem
            button
            aria-label="icon-button"
            component={Link}
            href="https://irfan7junior.in/blogs"
            onClick={() => {
              setOpenDrawer(false)
            }}
            divider
            style={{ opacity: '1' }}
            className={css.listItem}
          >
            <ListItemText disableTypography classes={{ root: classes.flexDR }}>
              Blogs
            </ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton
        aria-label="toggle-drawer"
        onClick={() => setOpenDrawer(!openDrawer)}
        className={css.iconButton}
      >
        <MenuIcon className={css.menuIcon} />
      </IconButton>
    </>
  )

  const tabs = (
    <>
      <Grid
        item
        container
        justifyContent="flex-end"
        style={{ marginRight: '2rem' }}
      >
        <Grid item className={classes.marginX}>
          <Button
            variant="contained"
            style={{
              color: 'white',
              backgroundColor: theme.palette.secondary.light,
            }}
            href="https://irfan7junior.in/resume"
          >
            Resume
          </Button>
        </Grid>
        <Grid item className={classes.marginX}>
          <Button
            variant="contained"
            style={{
              color: 'white',
              backgroundColor: theme.palette.secondary.light,
            }}
            href="https://irfan7junior.in/blogs"
          >
            Blogs
          </Button>
        </Grid>
      </Grid>
    </>
  )

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" className={css.appbar}>
          <Toolbar disableGutters>
            <Button
              className={css.logoButton}
              variant="contained"
              color="primary"
              component={Link}
              href="/"
            >
              <img
                src="/assets/logo.svg"
                alt="site-logo"
                className={css.logo}
              />
            </Button>
            {matches ? drawer : tabs}
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <div className={css.toolbarMargin}></div>
    </>
  )
}
const useStyles = makeStyles<MyTheme>((theme) => ({
  estimate: {
    ...theme.typography.estimate,
    backgroundColor: theme.palette.secondary.light,
    '&:hover': {
      background: theme.palette.secondary.light,
    },
  },
  listItem: {
    ...theme.typography.tab,
    color: theme.palette.common.white,
    opacity: '1',
  },
  drawer: {
    background: theme.palette.common.black,
    opacity: '1',
    width: '100vw',
  },
  toggleMenu: {
    marginRight: '5px',
    marginLeft: 'auto',
  },
  logoButton: {
    padding: 0,
    backgroundColor: 'inherit',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  iconButton: {
    marginLeft: 'auto',
  },
  menuIcon: {
    color: 'white',
    height: '50px',
    width: '50px',
  },
  button: {
    ...theme.typography.estimate,
    borderRadius: '50px',
    minWidth: '150px',
    height: '45px',
    marginLeft: '40px',
    marginRight: '40px',
    backgroundColor: theme.palette.secondary.main,
  },
  tabs: {
    background: 'black',
    marginLeft: 'auto',
    marginRight: '2rem',
  },
  tab: {
    minWidth: 10,
    marginLeft: '25px',
    opacity: '1',
    ...theme.typography.tab,
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: '2rem',
    [theme.breakpoints.down('md')]: {
      marginBottom: '1rem',
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: '1.5rem',
    },
  },
  appbar: {
    backgroundColor: 'black',
    zIndex: theme.zIndex.modal + 1,
  },
  logo: {
    height: '6rem',
    marginRight: 'auto',
    marginLeft: '2.5rem',
    [theme.breakpoints.down('lg')]: {
      marginLeft: '0',
    },
    [theme.breakpoints.down('md')]: {
      height: '5rem',
    },
    [theme.breakpoints.down('xs')]: {
      height: '4.65rem',
    },
  },
}))

export default withStyles(styles)(Header)

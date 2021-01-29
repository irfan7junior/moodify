import React from 'react'
import { makeStyles, withStyles, WithStyles, Grid } from '@material-ui/core'
import { styles } from 'src/styles/global'
import { MyTheme } from 'src/styles/material-ui'

export interface IFooter {}

const Footer: React.FC<IFooter & WithStyles<typeof styles>> = ({}) => {
  const css = useStyles()
  return (
    <footer className={css.footer}>
      <img
        src="/assets/footer_adornment.svg"
        alt="adornment"
        className={css.adornment}
      />
      <Grid
        container
        justifyContent="flex-end"
        spacing={2}
        className={css.socialMediaContainer}
      >
        <Grid
          item
          component={'a'}
          href="https://facebook.com/irfan7junior"
          rel="nofollow noreferrer"
          target="_blank"
        >
          <img
            className={css.socialMediaImage}
            src="/assets/facebook.svg"
            alt="facebook"
          />
        </Grid>
        <Grid
          item
          component={'a'}
          href="https://instagram.com/irfan7junior"
          rel="nofollow noreferrer"
          target="_blank"
        >
          <img
            className={css.socialMediaImage}
            src="/assets/instagram.svg"
            alt="instagram"
          />
        </Grid>
        <Grid
          item
          component={'a'}
          href="https://twitter.com/Irfan7junior"
          rel="nofollow noreferrer"
          target="_blank"
        >
          <img
            className={css.socialMediaImage}
            src="/assets/twitter.svg"
            alt="twitter"
          />
        </Grid>
      </Grid>
    </footer>
  )
}

const useStyles = makeStyles<MyTheme>((theme) => ({
  socialMediaContainer: {
    position: 'absolute',
    marginTop: '-6rem',
    right: '1.5rem',
  },
  socialMediaImage: {
    height: '4rem',
    width: '4rem',
    [theme.breakpoints.down('md')]: {
      height: '3rem',
      width: '3rem',
    },
    [theme.breakpoints.down('xs')]: {
      height: '2rem',
      width: '2rem',
    },
  },
  footer: {
    backgroundColor: theme.palette.common.black,
    marginTop: '10rem',
  },
  itemLink: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1rem',
    fontFamily: 'Raleway',
    textDecoration: 'none',
  },
  gridItem: {
    margin: '3rem',
  },
  mainContainer: {
    position: 'absolute',
  },
  adornment: {
    verticalAlign: 'bottom',
    [theme.breakpoints.down('md')]: {
      width: '20rem',
    },
    [theme.breakpoints.down('sm')]: {
      width: '15rem',
    },
  },
}))

export default withStyles(styles)(Footer)

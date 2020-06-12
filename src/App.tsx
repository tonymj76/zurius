import React from 'react';
import {InputBase, Grid, Paper} from '@material-ui/core'
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image : {
      height: 'auto',
      width: '300px',
      [theme.breakpoints.up('md')]: {
        width: '100%'
      }
    },
    root: {
      flexGrow: 1,
      marginTop:'7rem',
      maxHeight: '80vh'
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.15),
      },
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'blue',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '20ch',
        '&:focus': {
          width: '40ch',
        },
      },
    },
  }),
);

const App = () => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
            <img className={classes.image}
              src="https://res.cloudinary.com/oluwatobiloba/image/upload/v1591795521/incredible%20project/hero-image_ixmtkr.png"
              alt="" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper className={classes.search}>
              <div className={classes.searchIcon}>
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ 'aria-label': 'search' }}
              />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
};

export default App;

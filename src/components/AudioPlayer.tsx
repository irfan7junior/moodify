import React, { useEffect, useRef, useState } from 'react'
import {
  Grid,
  makeStyles,
  withStyles,
  WithStyles,
  IconButton,
  Typography,
} from '@material-ui/core'
import { styles } from 'src/styles/global'
import {
  PauseCircleOutline,
  PlayArrow,
  PlayCircleFilledOutlined,
} from '@material-ui/icons'
import clsx from 'clsx'

export interface IAudioPlayer {
  previewURL: string
}

const AudioPlayer: React.FC<IAudioPlayer & WithStyles<typeof styles>> = ({
  previewURL,
  classes,
}) => {
  const css = useStyles()
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (playing) audioRef.current!.play()
    else audioRef.current!.pause()
  }, [playing])

  return (
    <IconButton
      aria-label="audio-player"
      classes={{ root: css.preview }}
      onClick={() => setPlaying(!playing)}
    >
      {playing ? <PauseCircleOutline /> : <PlayArrow />}
      <Typography
        variant="h6"
        color="secondary"
        style={{
          fontFamily: 'Langar,Roboto,Pacifico,sans-serif,cursive',
          fontWeight: 500,
          fontSize: '.80rem',
          lineHeight: 1.6,
          color: '#ff9100',
          marginLeft: '1px',
          marginTop: '0',
          marginBottom: '0',
        }}
      >
        Play
      </Typography>
      <audio
        src={previewURL}
        ref={audioRef}
        style={{ display: 'none' }}
      ></audio>
    </IconButton>
  )
}
const useStyles = makeStyles((theme) => ({
  mainGrid: {
    backgroundColor: 'grey',
  },
  preview: {
    padding: '3px',
    borderRadius: '25px',
    background: '#f6e7e7',
  },
}))

export default withStyles(styles)(AudioPlayer)

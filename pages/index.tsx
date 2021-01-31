import React, { useEffect, useRef, useState } from 'react'
import {
  Grid,
  makeStyles,
  withStyles,
  WithStyles,
  Button,
  Container,
  Snackbar,
  CircularProgress,
  colors,
  SnackbarContent,
  Chip,
  Avatar,
} from '@material-ui/core'
import clsx from 'clsx'
import * as faceapi from 'face-api.js'
import Head from 'next/head'
import Link from 'src/Link'

import { styles } from 'src/styles/global'
import { CLIENT_WEBSITE as WEBSITE } from 'src/defaults'
import { FaceExpressions } from 'face-api.js'

interface valueType {
  value: number
}
interface colorType {
  color: string
}
interface moodType {
  mood: string
}

type keyType = Extract<keyof Omit<FaceExpressions, 'asSortedArray'>, string>

type ArrayResultReturnType = Partial<
  Record<keyType, Omit<FaceExpressions, 'asSortedArray'>>
> &
  valueType &
  colorType &
  moodType

const convertObjectToArrayObjects = (
  faceExpressions: Omit<FaceExpressions, 'asSortedArray'>
) => {
  const result: ArrayResultReturnType[] = []

  const mapMoodToColor: Record<keyType, string> = {
    angry: colors.red[500],
    disgusted: '#fff',
    fearful: colors.purple[500],
    happy: colors.green[500],
    neutral: 'teal',
    sad: 'grey',
    surprised: colors.yellow[500],
  }
  for (const item in faceExpressions) {
    result.push({
      [item]: parseInt(faceExpressions[item as keyType].toPrecision(3)),
      value: parseInt(faceExpressions[item as keyType].toPrecision(3)),
      color: mapMoodToColor[item as keyType],
      mood: item,
    })
  }

  result.sort((a, b) => {
    if (a.value < b.value) return 1
    else if (a.value > b.value) return -1
    return 0
  })

  return result
}

const initialState = {
  angry: 0,
  disgusted: 0,
  fearful: 0,
  happy: 0,
  neutral: 0,
  sad: 0,
  surprised: 0,
}

const maxCount = 25

export interface Iindex {}

const index: React.FC<Iindex & WithStyles<typeof styles>> = ({ classes }) => {
  const css = useStyles()

  const [videoHidden, setVideoHidden] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const webcamStream = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [toggleStart, setToggleStart] = useState(true)
  const [faceExpressions, setFaceExpressions] = useState<
    Omit<FaceExpressions, 'asSortedArray'>
  >(initialState)
  const [expressionCount, setExpressionCount] = useState<number>(0)
  const [finalExpression, setFinalExpression] = useState<
    Omit<FaceExpressions, 'asSortedArray'>
  >(initialState)
  const [snackbarOptions, setSnackbarOptions] = useState({
    message: '',
    backgroundColor: '',
    on: false,
  })
  const [finalExpressionReturn, setFinalExpressionReturn] = useState<
    ArrayResultReturnType[]
  >(
    Object.keys({ ...initialState }).map((item) => {
      return {
        color: '',
        value: 0,
        [item]: 0,
        mood: item,
      }
    })
  )

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => setLoaded(true))
  }, [])

  const onVideoPlay = () => {
    setExpressionCount(0)
    canvasRef.current!.innerHTML = (faceapi.createCanvasFromMedia(
      videoRef.current!
    ) as unknown) as string
    canvasRef.current!.style.transform = 'scale(-1, 1)'
    const displaySize = {
      width: videoRef.current!.width,
      height: videoRef.current!.height,
    }
    faceapi.matchDimensions(canvasRef.current!, displaySize)

    clearInterval(intervalRef.current!)
    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          videoRef.current!,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceExpressions()
      const resizedDetections = faceapi.resizeResults(detections, displaySize)
      const ctx = canvasRef.current!.getContext('2d')!
      detections.forEach(({ expressions }) => {
        setExpressionCount((prevExpressionCount) => prevExpressionCount + 1)
        setFaceExpressions((prevFaceExpressions) => ({
          angry: prevFaceExpressions.angry + expressions.angry,
          disgusted: prevFaceExpressions.disgusted + expressions.disgusted,
          fearful: prevFaceExpressions.fearful + expressions.fearful,
          happy: prevFaceExpressions.happy + expressions.happy,
          neutral: prevFaceExpressions.neutral + expressions.neutral,
          sad: prevFaceExpressions.sad + expressions.sad,
          surprised: prevFaceExpressions.surprised + expressions.surprised,
        }))
      })
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      faceapi.draw.drawFaceLandmarks(canvasRef.current!, resizedDetections)
      // faceapi.draw.drawDetections(canvasRef.current!, resizedDetections)
      // faceapi.draw.drawFaceExpressions(canvasRef.current!, resizedDetections)
    }, 100)
  }

  useEffect(() => {
    if (expressionCount > maxCount) {
      stopVideo()
      setExpressionCount(0)
      setFinalExpression((prevState) => {
        const answers = {
          angry: faceExpressions.angry * (100 / maxCount),
          disgusted: faceExpressions.disgusted * (100 / maxCount),
          fearful: faceExpressions.fearful * (100 / maxCount),
          happy: faceExpressions.happy * (100 / maxCount),
          neutral: faceExpressions.neutral * (100 / maxCount),
          sad: faceExpressions.sad * (100 / maxCount),
          surprised: faceExpressions.surprised * (100 / maxCount),
        }
        setFinalExpressionReturn(convertObjectToArrayObjects(answers))
        return answers
      })
      setFaceExpressions({
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        surprised: 0,
        sad: 0,
      })
      setSnackbarOptions({
        on: true,
        message: 'Completed',
        backgroundColor: 'teal',
      })
      setTimeout(() => {
        setSnackbarOptions((prevState) => ({
          ...prevState,
          on: false,
        }))
      }, 2500)
    }
  })

  useEffect(() => {
    return () => {
      videoRef.current?.removeEventListener('playing', onVideoPlay)
      clearInterval(intervalRef.current!)
    }
  }, [])

  const startVideo = () => {
    setSnackbarOptions({
      backgroundColor: colors.green[500],
      on: true,
      message: 'Processing',
    })
    setVideoHidden(false)
    videoRef.current!.style.transform = 'scale(-1, 1)'
    navigator.mediaDevices
      .getUserMedia({
        video: {},
      })
      .then((stream) => {
        videoRef.current!.srcObject = stream

        webcamStream.current = stream
      })
      .catch((error) => console.log(error))
    canvasRef.current!.hidden = false
    videoRef.current?.addEventListener('playing', onVideoPlay)

    setToggleStart(false)
  }

  const stopVideo = () => {
    setSnackbarOptions((prevState) => ({
      on: false,
      message: '',
      backgroundColor: '',
    }))
    setVideoHidden(true)
    canvasRef.current!.hidden = true
    clearInterval(intervalRef.current!)
    webcamStream.current?.getTracks().forEach((track) => track.stop())
    setToggleStart(true)
  }

  return (
    <Container maxWidth="md">
      <Grid container justifyContent="center" className={clsx(css.mainGrid)}>
        <Head>
          <title key="title">Moodify. Music Full of Expressions</title>
          <meta
            name="description"
            key="description"
            content="Listen to songs based on how you feel."
          />
          <meta
            property="og:title"
            content="Listen to songs based on how you feel."
            key="og:title"
          />
          <meta property="og:url" key="og:url" content={WEBSITE} />
          <link rel="canonical" key="canonical" href={WEBSITE} />
        </Head>
        <Grid
          item
          container
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          className={classes.padding}
        >
          <Grid
            item
            style={{ position: 'relative', height: '400px', width: '400px' }}
          >
            <video
              ref={videoRef}
              muted
              autoPlay
              height="400px"
              width="400px"
              hidden={videoHidden}
              className={css.video}
            ></video>
            <canvas
              ref={canvasRef}
              style={{ position: 'absolute', left: 0, top: 0 }}
            />
          </Grid>
          <Grid item>
            <Grid item container justifyContent="center">
              <Grid item>
                <Button
                  onClick={startVideo}
                  variant="contained"
                  className={classes.margin}
                  color="primary"
                  disabled={!loaded || !toggleStart}
                >
                  {loaded ? 'Start' : 'Wait'}
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={stopVideo}
                  variant="contained"
                  className={classes.margin}
                  color="primary"
                  disabled={!loaded || toggleStart}
                >
                  Stop
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Container maxWidth="sm">
            <Grid
              item
              container
              flexWrap
              justifyContent="center"
              className={css.moodChips}
            >
              {finalExpressionReturn.slice(0, 3).map((expression) => (
                <Chip
                  size="medium"
                  label={expression.mood.toUpperCase()}
                  key={expression.mood}
                  style={{
                    backgroundColor: expression.color,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: expression.color,
                        color: 'white',
                      }}
                    >
                      {expression.value}
                    </Avatar>
                  }
                />
              ))}
            </Grid>
          </Container>
        </Grid>
      </Grid>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        ClickAwayListenerProps={{
          onClickAway: (event) => {},
        }}
        open={snackbarOptions.on}
        onClose={() =>
          setSnackbarOptions((prevState) => ({ ...prevState, on: false }))
        }
        style={{ backgroundColor: snackbarOptions.backgroundColor }}
      >
        <SnackbarContent
          style={{
            backgroundColor: snackbarOptions.backgroundColor,
          }}
          message={<span id="client-snackbar">{snackbarOptions.message}</span>}
          action={
            videoRef.current?.paused ? (
              <> </>
            ) : (
              <CircularProgress
                variant="determinate"
                color="secondary"
                value={expressionCount * (100 / maxCount)}
              />
            )
          }
        />
      </Snackbar>
    </Container>
  )
}
const useStyles = makeStyles((theme) => ({
  mainGrid: {
    minHeight: '25rem',
  },
  video: {
    transform: 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
    boxShadow: '0 0 5px black',
  },
  moodChips: {
    '& > *': {
      margin: theme.spacing(0.5),
    },
    marginTop: '2rem',
    boxShadow: '0 0 5px black',
  },
}))

export default withStyles(styles)(index)

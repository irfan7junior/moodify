import React, { useEffect, useRef, useState } from 'react'
import {
  Grid,
  makeStyles,
  withStyles,
  WithStyles,
  Button,
} from '@material-ui/core'
import { styles } from 'src/styles/global'
import clsx from 'clsx'
import * as faceapi from 'face-api.js'
import { CLIENT_WEBSITE as WEBSITE } from 'src/defaults'
import Head from 'next/head'

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

  useEffect(() => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
      faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    ]).then(() => setLoaded(true))
  }, [])

  const onVideoPlay = () => {
    canvasRef.current!.innerHTML = (faceapi.createCanvasFromMedia(
      videoRef.current!
    ) as unknown) as string
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
      // detections.forEach((detection) => console.log(detection.expressions))
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
      faceapi.draw.drawDetections(canvasRef.current!, resizedDetections)
      faceapi.draw.drawFaceLandmarks(canvasRef.current!, resizedDetections)
      faceapi.draw.drawFaceExpressions(canvasRef.current!, resizedDetections)
    }, 100)
  }

  useEffect(() => {
    return () => {
      videoRef.current?.removeEventListener('playing', onVideoPlay)
      clearInterval(intervalRef.current!)
    }
  }, [])

  const startVideo = () => {
    setVideoHidden(false)
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
    setVideoHidden(true)
    canvasRef.current!.hidden = true
    clearInterval(intervalRef.current!)
    webcamStream.current?.getTracks().forEach((track) => track.stop())
    setToggleStart(true)
  }

  return (
    <Grid container justifyContent="center" className={clsx(css.mainGrid)}>
      <Head>
        <title key="title">
          Moodify. Music Full of Expressions | irfan7junior
        </title>
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
        <Grid item container justifyContent="center">
          <Grid item></Grid>
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
const useStyles = makeStyles((_theme) => ({
  mainGrid: {
    minHeight: '25rem',
  },
  video: {
    borderRadius: '50%',
  },
}))

export default withStyles(styles)(index)

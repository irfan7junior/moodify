import { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios'
import { FaceExpressions } from 'face-api.js'
import qs from 'qs'
import spotifyWebApi from 'spotify-web-api-node'

const getRandomNumber = (array: any[]): number => {
  return Math.floor(Math.random() * array.length)
}

const seed_artists = [
  '0E02VcvA5p1ndkLdqWD5JB',
  '4fEkbug6kZzzJ8eYX6Kbbp',
  '7HCqGPJcQTyGJ2yqntbuyr',
  '3eDT9fwXKuHWFvgZaaYC5v',
  '5GnnSrwNCGyfAU4zuIytiS',
  '5T2I75UlGBcWd5nVyfmL13',
  '3OLGltG8UPIea8sA4w0yg0',
  '2oSONSC9zQ4UonDKnLqksx',
  '6CXEwIaXYfVJ84biCxqc9k',
  '7uIbLdzzSEqnX0Pkrb56cR',
  '1wRPtKGflJrBx9BmLsSwlU',
  '0oOet2f43PA68X5RxKobEy',
  '61if35zz1W11GejEkxTLEQ',
  '4oVMLzAqW6qhRpZWt8fNw4',
  '09UmIX92EUH9hAK4bxvHx6',
  '2L16nDKTxhFGaDriR2AHTB',
  '71oGOxg5ez52Hh1Ye41A98',
  '7HHLBC9hUb55SDUcBlM8FQ',
  '0sSxphmGskGCKlwB9xa6WU',
  '0L5GV6LN8SWWUWIdBbTLTZ',
]

const seed_genres = [
  'acoustic',
  'ambient',
  'anime',
  'black-metal',
  'blues',
  'bossanova',
  'brazil',
  'breakbeat',
  'british',
  'classical',
  'comedy',
  'country',
  'dance',
  'disney',
  'edm',
  'electro',
  'folk',
  'groove',
  'guitar',
  'happy',
  'hard-rock',
  'hardcore',
  'heavy-metal',
  'hip-hop',
  'holidays',
  'indian',
  'jazz',
  'k-pop',
  'kids',
  'metal',
  'movies',
  'new-age',
  'new-release',
  'rock',
  'rock-n-roll',
  'rockabilly',
  'romance',
  'sad',
  'sleep',
  'soul',
  'soundtracks',
  'study',
  'summer',
  'work-out',
  'world-music',
]

const market = 'IN'

export default async (req: NowRequest, res: NowResponse) => {
  const data = qs.stringify({
    grant_type: 'client_credentials',
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  })

  const response = await axios({
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data,
  })

  const { angry, disgusted, fearful, happy, neutral, sad, surprised } = req.body
    .expressions as Omit<FaceExpressions, 'asSortedArray'>

  const expressionValue = Math.min(
    1,
    Math.max(
      0,
      (neutral / 2 +
        happy * 3 -
        sad * 5 -
        disgusted * 5 -
        angry * 5 -
        fearful * 5) /
        100
    )
  )

  const target_danceability = expressionValue
  const target_energy = expressionValue
  const target_loudness = expressionValue

  // console.log({ target_danceability, target_energy, target_loudness })

  const spotifyApi = new spotifyWebApi({})
  spotifyApi.setAccessToken(response.data.access_token)

  // console.log(spotifyApi.getAccessToken())

  const genres: string[] = []
  for (let i = 0; i < 4; i++) {
    genres[i] = seed_genres[getRandomNumber(seed_genres)]
  }

  let count = 0
  let results: any = { body: { tracks: [] } }
  while (true && count < 100) {
    results = await spotifyApi.getRecommendations({
      market,
      seed_artists:
        seed_artists[Math.floor(Math.random() * seed_artists.length)],
      seed_genres: ['indian'],
      limit: 10,
      target_danceability,
      target_energy,
      target_loudness,
    })
    console.log(results.body.tracks)
    count++
    if (results.body.tracks.length > 0) break
  }

  if (results)
    res.status(200).json({
      results: results.body.tracks,
    })
}

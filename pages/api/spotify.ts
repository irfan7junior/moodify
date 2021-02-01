import { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios'
import { FaceExpressions } from 'face-api.js'
import qs from 'qs'
import spotifyWebApi from 'spotify-web-api-node'

const seed_artists = [
  '5GnnSrwNCGyfAU4zuIytiS',
  '06HL4z0CvFAxyc27GXpf02',
  '4fEkbug6kZzzJ8eYX6Kbbp',
]
const seed_genres = ['modern bollywood', 'hip hop', 'sufi', 'dance pop'].join(
  ', '
)
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

  const results = await spotifyApi.getRecommendations({
    market,
    seed_artists: seed_artists[Math.floor(Math.random() * seed_artists.length)],
    seed_genres,
    limit: 10,
    target_danceability,
    target_energy,
    target_loudness,
  })

  res.status(200).json({
    results: results.body.tracks,
  })
}

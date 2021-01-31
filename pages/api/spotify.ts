import { NowRequest, NowResponse } from '@vercel/node'
import axios from 'axios'
import qs from 'qs'
import spotifyWebApi from 'spotify-web-api-node'

export default async (_req: NowRequest, res: NowResponse) => {
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
      Cookie:
        '__Host-device_id=AQDUgM1GLRm3A1DK23itzgiTP2qM5MNdBCXHPGdusVG8kQ6CcifHjT3rCxZxgFhdlpUnPRaAEbfZuJ1iILwhV8uWRoRrCSJkzLg',
    },
    data,
  })

  const spotifyApi = new spotifyWebApi({})
  spotifyApi.setAccessToken(response.data.access_token)

  res.status(200).json({
    token: response.data.access_token,
  })
}

import { NowRequest, NowResponse } from '@vercel/node'

export default (_request: NowRequest, response: NowResponse) => {
  response.status(200).json({
    error: false,
    data: 'Hello World!',
  })
}

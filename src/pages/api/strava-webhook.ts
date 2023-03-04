// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendSlackBlocks } from '@/utils/slack'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'GET') {
      // Your verify token. Should be a random string.
      const VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN
      // Parses the query params
      const mode = req.query['hub.mode']
      const token = req.query['hub.verify_token']
      const challenge = req.query['hub.challenge']
      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Verifies that the mode and token sent are valid
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          console.log('WEBHOOK VERIFIED')
          res.json({ 'hub.challenge': challenge })
          return
        }
        // Responds with '403 Forbidden' if verify tokens do not match
      }
      res.status(403).json({ err: 'Forbidden' })
      return
    }
    if (req.method === 'POST') {
      console.log('WEBHOOK RECEIVED DATA:', req.query, req.body)
      await sendSlackBlocks(
        '`beta.nqhuy.dev` - Receive event from strava webhook',
        { type: 'section', text: { type: 'mrkdwn', text: `\`\`\`${JSON.stringify(req.body || {})}\`\`\`` } }
      )
      res.status(200).send({ message: '_tracking.message.sent' })
      return
    }
    res.status(404).send({ err: 'Invalid request' })
  } catch (err) {
    console.error('Error when handling request:', req.method, err)
    res.status(404).send({ err: 'Invalid request!' })
  }
}

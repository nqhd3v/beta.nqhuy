// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sendSlackMessage } from '@/utils/slack'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // if (req.method === 'GET') {
    // }
    if (req.method === 'POST') {
      if (!req.body || !req.body.message) {
        res.status(400).send({ message: 'exception._tracking.message.invalid' })
        return
      }
      await sendSlackMessage(req.body.message)
      res.status(200).send({ message: '_tracking.message.sent' })
      return
    }
  } catch (err) {
    console.error('Error when handling request:', req.method, err)
  }
  res.status(404).send({ message: 'exception._tracking.unknown' })
}

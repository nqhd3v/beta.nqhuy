// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { syncStravaActivities } from '@/services/firebase-strava'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === 'POST') {
      const activities = await syncStravaActivities()
      res.status(200).send({ message: '_tracking.sync.done', data: activities })
      return
    }
    res.status(404).send({ err: 'exception.request.invalid-method', resource: 'strava-sync' })
  } catch (err) {
    console.error('[slack-webhook] - Error when handling request:', req.method, err)
    res.status(404).send({ err: 'exception.request.unknown', resource: 'strava-sync' })
  }
}

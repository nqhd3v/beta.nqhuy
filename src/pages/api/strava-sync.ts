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
      if (!Array.isArray(activities)) {
        res.status(400).send({
          message: 'exception._tracking.invalid-response',
          data: activities
        })
        return
      }
      res.status(200).send({
        message: '_tracking.sync.done',
        data: {
          length: activities.length
        }
      })
      return
    }
    res.status(404).send({ err: 'exception.request.invalid-method', resource: 'strava-sync' })
  } catch (err) {
    console.error('[slack-webhook] - Error when handling request:', req.method, err)
    res.status(404).send({ err: 'exception.request.unknown', resource: 'strava-sync' })
  }
}

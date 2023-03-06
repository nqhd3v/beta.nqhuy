// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { addStravaActivity, getStravaAuthorizeInfo } from '@/services/firebase-strava'
import { tStravaActivityOrigin } from '@/types/strava'
import fetchJS from '@/utils/fetch-js'
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
          res.json({ 'hub.challenge': challenge })
          return
        }
        // Responds with '403 Forbidden' if verify tokens do not match
      }
      res.status(403).json({ err: 'Forbidden' })
      return
    }
    if (req.method === 'POST') {
      await sendSlackBlocks(
        'Receive event from Strava',
        `\`\`\`${JSON.stringify(req.body)}\`\`\``
      )
      if (!req.body.object_id) {
        res.status(200).send(req.body)
        return
      }
      const { accessToken, err } = await getStravaAuthorizeInfo()
      if (err) {
        res.status(400).send({ err })
        return
      }
      const activity = await fetchJS<tStravaActivityOrigin>(`https://www.strava.com/api/v3/activities/${req.body.object_id}?include_all_efforts=`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (typeof activity !== 'object') {
        await sendSlackBlocks(
          'Cannot create a new activity in Fs: INVALID FORMAT',
          'nqhuy-beta-version - https://beta.nqhuy.dev/running',
          `\`\`\`${JSON.stringify(activity)}\`\`\``
        )
        res.status(400).send({ err: 'exception._tracking.activity.invalid-format', data: activity })
        return
      }
      await addStravaActivity(activity)

      res.status(200).send({ message: '_tracking.message.sent', data: activity })
      return
    }
    res.status(404).send({ err: 'exception.request.invalid-method', resource: 'strava-webhook' })
  } catch (err) {
    console.error('[slack-webhook] - Error when handling request:', req.method, err)
    res.status(404).send({ err: 'exception.request.unknown', resource: 'strava-webhook' })
  }
}

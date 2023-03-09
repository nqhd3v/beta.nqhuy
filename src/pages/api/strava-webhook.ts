// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { addStravaActivity, getStravaAuthorizeInfo, updateStravaActivity } from '@/services/firebase-strava'
import { tStravaActivityOrigin } from '@/types/strava'
import fetchJS from '@/utils/fetch-js'
import { json2SlackCode } from '@/utils/mapping'
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
        json2SlackCode(req.body)
      )
      if (!req.body.object_id || !req.body.owner_id || !req.body.aspect_type) {
        await sendSlackBlocks(
          'Got invalid action',
          'nqhuy-beta-version - https://beta.nqhuy.dev/running',
          json2SlackCode(req.body)
        )
        res.status(400).send(req.body)
        return
      }
      if (`${req.body.owner_id}` !== process.env.STRAVA_USR_ID as string) {
        res.status(403).send({ err: 'exception._tracking.user.not-allowed', data: req.body })
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
          `"${req.body.object_type}.${req.body.aspect_type}" - Error: INVALID FORMAT`,
          'nqhuy-beta-version - https://beta.nqhuy.dev/running',
          json2SlackCode(activity)
        )
        res.status(400).send({ err: 'exception._tracking.activity.invalid-format', data: activity })
        return
      }
      await sendSlackBlocks(
        `"${req.body.object_type}.${req.body.aspect_type}" - ID=${req.body.object_id}`,
        'nqhuy-beta-version - https://beta.nqhuy.dev/running',
        json2SlackCode(activity)
      )
      if (req.body.aspect_type === 'create') {
        await addStravaActivity(activity)
      } else if (req.body.aspect_type === 'update') {
        await updateStravaActivity(req.body.object_id, req.body.updates)
      }

      res.status(200).send({ message: '_tracking.message.sent', data: { activity } })
      return
    }
    res.status(404).send({ err: 'exception.request.invalid-method', resource: 'strava-webhook' })
  } catch (err) {
    console.error('[slack-webhook] - Error when handling request:', req.method, err)
    res.status(404).send({ err: 'exception.request.unknown', resource: 'strava-webhook' })
  }
}

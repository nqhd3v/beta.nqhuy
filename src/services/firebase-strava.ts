import { fsAdd, fsReadOne, fsRemoveCol, fsUpdate } from '@/utils/firebase/firestore'
import type { tStravaActivityOrigin } from '@/types/strava'
import { json2URLFormData, stravaActivities2Activities } from '@/utils/mapping'
import fetchJS from '@/utils/fetch-js'
import { iFirestoreConfigurationStrava } from '@/types/firebase'
import { sendSlackBlocks } from '@/utils/slack'

const saveStravaAuthorizeInfo = async ({
  accessToken,
  refreshToken,
  expiresAt
}: { accessToken: string, refreshToken: string, expiresAt: number }) => {
  try {
    return await fsUpdate({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt
    }, 'configuration', 'strava')
  } catch (err) {
    console.error('Error when saving authorized information to firebase:', err)
    return {
      err
    }
  }
}

const addStravaActivity = async (data: tStravaActivityOrigin) => {
  try {
    const activities = stravaActivities2Activities(data)
    return await fsAdd(activities[0], 'strava-activities')
  } catch (err) {
    console.error('Error when add a new activity to Firestore:', err)
    return {
      err
    }
  }
}

const syncStravaActivities = async () => {
  try {
    await fsRemoveCol('strava-activities')
    const { accessToken, err } = await getStravaAuthorizeInfo()
    if (err) return { err }
    const activities = await fetchJS(
      'https://www.strava.com/api/v3/athlete/activities?before=&after=&page=1&per_page=2',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    console.log('activities: https://www.strava.com/api/v3/athlete/activities?before=&after=&page=0&per_page=2', activities)
  } catch (err) {
    console.error('Error when sync strava activities and "firestore/strava-activities":', err)
    return { err }
  }
}

const getStravaAuthorizeInfo = async () => {
  try {
    const stravaAuthorize = await fsReadOne<iFirestoreConfigurationStrava>('configuration', 'strava')
    if (!stravaAuthorize) {
      await sendSlackBlocks(
        'No authorized info available in Firebase',
        'App https://beta.nqhuy.dev (nqhuy-beta-ver)',
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Click this button to re-authorize your strava account.'
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 're-authorize'
            },
            value: 're_authorize_strava_account',
            url: 'https://beta.nqhuy.dev/running/strava',
            action_id: 're-authorize-btn'
          }
        }
      )
      return { err: 'exception._tracking.no-authorized-available' }
    }
    const { access_token: accessToken, refresh_token: refreshToken, expires_at: expiresAt } = stravaAuthorize.data
    if (Date.now() >= expiresAt) {
      const body = json2URLFormData({
        client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
      })
      const refreshTokenRes = await fetchJS<iFirestoreConfigurationStrava>('https://www.strava.com/oauth/token', {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        }
      })
      if (typeof refreshTokenRes !== 'object') {
        await sendSlackBlocks(
          'Refresh authorized token got unexpected response',
          'App **nqhuy-beta-version** - https://beta.nqhuy.dev:',
          { type: 'section', text: { type: 'mrkdwn', text: `\`\`\`${JSON.stringify(refreshTokenRes)}\`\`\`` } }
        )
        return { err: 'exception._tracking.authorize.invalid-response', data: refreshTokenRes }
      }
      const { access_token: access, refresh_token: refresh, expires_at: exp } = refreshTokenRes
      await saveStravaAuthorizeInfo({
        accessToken: access,
        refreshToken: refresh,
        expiresAt: exp
      })
      return {
        accessToken: access
      }
    }
    return {
      accessToken
    }
  } catch (err) {
    console.error('Error when getting authorize info:', err)
    return { err }
  }
}

export {
  saveStravaAuthorizeInfo,
  addStravaActivity,
  getStravaAuthorizeInfo,
  syncStravaActivities
}

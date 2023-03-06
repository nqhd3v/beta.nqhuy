import { saveStravaAuthorizeInfo } from '@/services/firebase-strava'
import { json2URLFormData } from '@/utils/mapping'
import Image from 'next/image'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect, useReducer } from 'react'

interface iStravaAuthorizedState {
  athlete?: {
    bio: string;
    firstname: string;
    lastname: string;
    profile: string; // Avatar
    username: string;
    state: string;
    city: string;
  };
  expires_at?: number;
  refresh_token?: string;
  access_token?: string;
  err?: any
}
const initStates: iStravaAuthorizedState = {}
const StravaAuthorized = () => {
  const router = useRouter()
  const [{ err, ...data }, setState] = useReducer((
    a: iStravaAuthorizedState,
    b: Partial<iStravaAuthorizedState>
  ) => ({ ...a, ...b }), initStates)

  const handleSave2Fs = async ({
    accessToken,
    refreshToken,
    expiresAt
  }: {
    accessToken: iStravaAuthorizedState['access_token'];
    refreshToken: iStravaAuthorizedState['refresh_token'];
    expiresAt: iStravaAuthorizedState['expires_at'];
  }) => {
    if (!accessToken || !refreshToken || !expiresAt) {
      console.error('Empty data to save to firestore:', accessToken, refreshToken, expiresAt)
      return
    }
    const res = await saveStravaAuthorizeInfo({ accessToken, refreshToken, expiresAt })
    console.info('Save strava authorize info:', res)
  }

  const handleGetAccessCode = async (c: string) => {
    const body = json2URLFormData({
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET,
      code: c,
      grant_type: 'authorization_code'
    })
    const res = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body
    })
    const data = await res.json()
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const { resource, field, code } = data.errors[0]
      setState({ err: `${resource}: ${field}.${code}` })
      return
    }
    setState({
      err: undefined,
      ...data
    })
    await handleSave2Fs({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at
    })
  }
  const handleAuthorize = () => {
    const queryParams = {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      redirect_uri: `${window.location.origin}/running/strava`,
      response_type: 'code',
      scope: 'activity:read_all'
    }
    window.location.href = `https://www.strava.com/oauth/authorize?${queryString.stringify(queryParams)}`
  }

  useEffect(() => {
    // if (initStates.athlete) return
    if (router.isReady) {
      const code = router.query.code as string
      if (!code) {
        // If code has value -> It is response from strava after authorized
        handleAuthorize()
        return
      }
      handleGetAccessCode(code)
    }
  }, [router.isReady])

  if (!data.athlete) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-[400px] p-5 rounded-md bg-white dark:bg-dark-800">
          {err ? (<><span className='font-bold text-red-400'>Error:</span> {err}</>) : 'Redirecting to authorize page...'}
        </div>
      </div>
    )
  }
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className="w-[calc(100%-40px)] sm:w-[400px] overflow-hidden shadow-md rounded-md bg-white dark:bg-dark-800 pb-5">
        <div className="h-[80px] flex items-end justify-center mb-[66px] bg-dark-500">
          <div className="w-[100px] h-[100px] -mb-[50px] rounded-full overflow-hidden border border-white dark:border-dark-800">
            <Image width={100} height={100} src={data.athlete.profile} alt="profile-user" />
          </div>
        </div>

        <div className="text-center px-5">
          <div className="text-sm text-gray-400 dark:text-gray-600">authorized with</div>
          <div className="font-bold text-lg -mt-1 special-vn">{data.athlete.lastname} {data.athlete.firstname}</div>
          <div
            className={
              'relative text-gray-400 dark:text-gray-600 mt-8 ' +
              "before:content-[''] before:w-14 before:h-px before:bg-gray-400 dark:before:bg-gray-600 before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 "
            }
          >
            {data.athlete.bio}<br /><b className='underline'>@{data.athlete.username}</b>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StravaAuthorized

import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useEffect } from 'react'

const StravaAuthorized = () => {
  const router = useRouter()

  useEffect(() => {
    const queryParams = {
      client_id: process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
      redirect_uri: `${window.location.origin}/running/redirect`,
      response_type: 'code',
      scope: 'activity:read_all'
    }
    window.location.href = `https://www.strava.com/oauth/authorize?${queryString.stringify(queryParams)}`
  }, [router.isReady])

  return (
    <div></div>
  )
}

export default StravaAuthorized

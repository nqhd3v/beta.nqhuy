import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

const StravaRedirect = () => {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) console.log(router)
  }, [router.isReady])

  return (
    <div></div>
  )
}

export default StravaRedirect

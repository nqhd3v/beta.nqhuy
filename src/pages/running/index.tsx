import { NextSeo } from 'next-seo'
import React from 'react'
import StravaActivities from '@/components/strava-activities'
import { getRaceInfo } from '@/services/file-strava'
import { tRaceInfo, tStravaActivity } from '@/types/strava'
import RunningCountdown from '@/components/running-countdown'
import RunningStory from '@/components/running-story'
import { getStravaActivities } from '@/services/firebase-strava'

const RunningPage: React.FC<{ race: tRaceInfo, data: tStravaActivity[] }> = ({ race, data }) => {
  return (
    <>
      <NextSeo title="Running" description="This page will show you which I prepared for next race!" />
      <div className="page-content-width m-auto pb-16">
        <RunningCountdown race={race} />
        <RunningStory />
        <div className="text-lg special text-center">and now, let&apos;s run with me</div>
        <StravaActivities data={data} />
      </div>
    </>
  )
}

export default RunningPage

export async function getServerSideProps () {
  const data = await getStravaActivities()
  const race = await getRaceInfo()
  return {
    props: {
      race,
      data
    }
  }
}

import { tRaceInfo } from '@/types/strava'
import dayjs from 'dayjs'
import React, { useMemo } from 'react'

const RunningCountdown: React.FC<{ race?: tRaceInfo }> = ({ race }) => {
  const daysBefore = useMemo(() => {
    if (!race) return -1
    const runDate = dayjs(race.run_date)
    const now = dayjs()
    return runDate.diff(now, 'days')
  }, [race?.run_date])
  // const isAvailable = useMemo(() => daysBefore > 0, [daysBefore]);

  if (!race) {
    return (
      <div className="w-[calc(100%-40px)] sm:w-full lg:w-660px pt-[52px] m-auto mb-[52px] sm:pt-[100px]">
        <div className="flex items-center justify-center text-dark-200 dark:text-light-200">
          <div className="text-[52px] leading-[52px] special">no race currently</div>
        </div>
        <div className="text-center special text-lg text-dark-50 dark:text-light-50">
          just for fun
        </div>
      </div>
    )
  }

  return (
    <div className="w-[calc(100%-40px)] sm:w-full lg:w-660px pt-[52px] m-auto mb-[52px] sm:pt-[100px]">
      <div className="flex items-center justify-center text-dark-200 dark:text-light-200">
        <div className="text-[52px] leading-[52px] special">last</div>
        &nbsp;&nbsp;
        <div className="text-[72px] leading-[72px] special">{daysBefore}</div>
        &nbsp;&nbsp;
        <div className="text-[52px] leading-[52px] special">days.</div>
      </div>
      <div className="text-center special text-lg text-dark-50 dark:text-light-50">
        before
        {' '}
        <span className="bg-dark-50 dark:bg-light-50 text-white dark:text-dark-50 p-1 rounded special">
          {race.name}{' '}{race.dst}km
        </span>
        {' '}
        race!!
      </div>
    </div>
  )
}

export default RunningCountdown

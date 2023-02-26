import { tStravaActivity } from '@/types/strava'
import { TW_BOX_SHADOW } from '@/utils/constants'
import { date2HmmA, date2MMMDYYYY, roundNDec, runPace } from '@/utils/format'
import { useIsWidthMD, useMessage } from '@/utils/hooks'
import { arr2Mapping, s2Hm } from '@/utils/mapping'
import { AnimatePresence, AnimateSharedLayout, motion as m } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import PolylineMap from './polyline-map'

interface iStravaActivities {
  data: any[];
}
const StravaActivities: React.FC<iStravaActivities> = ({ data }) => {
  const mapping = useMemo(() => arr2Mapping(data), [data])
  const [hovering, setHovering] = useState<string | number | undefined>(undefined)
  const isWidthMd = useIsWidthMD()

  if (!isWidthMd) {
    return (
      <div className="w-full max-w-[500px] m-auto">
        <AnimateSharedLayout>
          <m.ul layout>
            {data.map(d => <StravaActivityToggleCard
              data={d}
              key={d.id}
              active={d.id === hovering}
              onToggle={() => setHovering(d.id === hovering ? undefined : d.id)}
            />)}
          </m.ul>
        </AnimateSharedLayout>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row relative h-[600px] max-h-[calc(100vh-100px)]">
      <div className="absolute top-1/2 -translate-y-1/2 left-5 z-10 pointer-events-none">
        <StravaActivityView data={hovering ? mapping[hovering] : {}} show={!!hovering} />
      </div>
      <div className="relative h-full w-[400px] ml-auto">
        {/* <div className="absolute top-0 left-0 right-0 pointer-events-none w-full h-10 bg-gradient-to-b from-blue-100 via-blue-100 to-blue-100/0 dark:from-dark-600 dark:via-dark-600 dark:to-dark-600/0 z-[1]" /> */}
        <div className="w-[400px] h-full overflow-auto hide-scrollbar">
          {data.map(a => <StravaActivityCard
            data={a}
            key={a.id}
            hoverStart={() => setHovering(a.id)}
            hoverEnd={() => setHovering(undefined)}
          />)}
        </div>
        {/* <div className="absolute bottom-0 left-0 right-0 pointer-events-none w-full h-10 bg-gradient-to-t from-blue-100 via-blue-100 to-blue-100/0 dark:from-dark-600 dark:via-dark-600 dark:to-dark-600/0 z-[1]" /> */}
      </div>
    </div>
  )
}

export default StravaActivities

interface iStravaActivityCard {
  data: any;
  hoverStart?: () => void;
  hoverEnd?: () => void;
}
const StravaActivityCard: React.FC<iStravaActivityCard> = ({ data, hoverStart, hoverEnd }) => {
  return (
    <m.div
      className={
        'w-full p-5 border border-gray-300 dark:border-gray-600 h-[80px] mb-0.5 ' +
        'bg-blue-100 dark:bg-dark-600 '
      }
      onHoverStart={() => hoverStart?.()}
      onHoverEnd={() => hoverEnd?.()}
      whileHover={{ x: -10, transition: { duration: 0.5 } }}
    >
      {data.name}
    </m.div>
  )
}

interface iStravaActivityToggleCard {
  data: tStravaActivity;
  active?: boolean;
  onToggle?: () => void;
}
const StravaActivityToggleCard: React.FC<iStravaActivityToggleCard> = ({ data, active, onToggle }) => {
  const msg = useMessage()
  const dateStr = useMemo(() => date2MMMDYYYY(data.start_date), [data.start_date])
  const hourStr = useMemo(() => date2HmmA(data.start_date), [data.start_date])

  return (
    <m.div
      className={
        'relative w-full px-3 pt-3 pb-8 border border-gray-300 dark:border-gray-600 mb-1 cursor-pointer ' +
        'bg-blue-100 dark:bg-dark-600 '
      }
      layout
      onClick={() => onToggle?.()}
    >
      <m.div className="w-full flex items-center justify-center mb-1">
        <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[calc(100%-50px)] text-2xl special-vn">
          {data.name}
        </div>
        <div className="w-14 flex items-center justify-end"><b>{roundNDec(data.distance / 1000)}</b>{' '}km</div>
      </m.div>
      <AnimatePresence mode="wait">
        {active
          ? (
            <m.div
              className='overflow-hidden relative'
              initial={{ height: 0 }}
              animate={{ height: 80, transition: { duration: 0.5 } }}
              exit={{ height: 0, transition: { duration: 0.5 } }}
            >
              <div className="absolute w-full h-full flex rounded-sm">
                <div className="w-[calc((100%-88px)/2)] relative flex items-center justify-center after:content-[''] after:h-3 after:w-px after:bg-gray-400/30 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 px-2">
                  <StravaFieldValue label='Time/Pace' value={['1h30m', '8:24']}/>
                </div>
                <div className="w-[calc((100%-88px)/2)] relative flex items-center justify-center after:content-[''] after:h-3 after:w-px after:bg-gray-400/30 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 px-2">
                  <StravaFieldValue label='Hr Avg/Max' value={[160, 181]}/>
                </div>
                <div className="w-[88px] relative flex items-center justify-end">
                  <div className="w-[78px] h-[78px] rounded-md flex items-center justify-center border border-gray-400 dark:border-gray-600">
                    <PolylineMap path={data.map} />
                  </div>
                </div>
              </div>
            </m.div>
            )
          : null}
      </AnimatePresence>
      <div className="absolute bottom-3 left-3 text-sm text-gray-400 dark:text-gray-600">
        {msg('time.at.hour-date', { hour: hourStr, date: dateStr })}
      </div>
    </m.div>
  )
}

const StravaActivityView: React.FC<{ data: tStravaActivity, show?: boolean }> = ({ data, show }) => {
  const msg = useMessage()
  const dateStr = useMemo(() => date2MMMDYYYY(data.start_date), [data.start_date])
  const hourStr = useMemo(() => date2HmmA(data.start_date), [data.start_date])

  return (
    <AnimatePresence mode="wait">
      {show
        ? (
          <m.div
            className='relative w-[360px] px-3 pt-3 pb-8 bg-white dark:bg-dark-600 border border-gray-300 dark:border-gray-700 '
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0, boxShadow: TW_BOX_SHADOW.lg, transition: { duration: 0.5, delay: 0.3 } }}
            exit={{ opacity: 0, y: '100%', transition: { duration: 0.5 } }}
            key={`strava-activities-preview-${data.id}`}
          >
            <div className="w-full flex items-center justify-center">
              <div className="font-bold text-ellipsis overflow-hidden whitespace-nowrap w-[calc(100%-50px)] text-2xl leading-6">
                {data.name}
              </div>
              <div className="w-14 flex items-center justify-end"><b>{roundNDec(data.distance / 1000)}</b>{' '}km</div>
            </div>
            <div className='overflow-hidden relative h-[80px] flex' >
              <div className="w-1/2 relative flex items-center after:content-[''] after:h-3 after:w-px after:bg-gray-400/30 after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">
                <StravaFieldValue label='Time/Pace' value={[s2Hm(data.moving_time), runPace(data.moving_time, data.distance)]}/>
              </div>
              <div className="w-1/2 relative flex items-center pl-2">
                <StravaFieldValue label='Hr Avg/Max' value={[data.average_heartrate, data.max_heartrate]}/>
              </div>
            </div>
            <div className="w-full h-[280px] border border-gray-300 dark:border-gray-700">
              <PolylineMap path={data.map} size={[336, 280]} />
            </div>
            <div className="absolute bottom-3 left-3 text-sm text-gray-400 dark:text-gray-600">
              {msg('time.at.hour-date', { hour: hourStr, date: dateStr })}
            </div>
          </m.div>
          )
        : null}
    </AnimatePresence>
  )
}

const StravaFieldValue: React.FC<{ label: string, value: any[] | any }> = ({ label, value }) => {
  return (
    <div className="relative pt-7 pb-3">
      <div className="absolute top-3 left-0 text-sm text-gray-400/70 dark:text-gray-600/70 uppercase underline whitespace-nowrap">{label}</div>
      {Array.isArray(value)
        ? (
        <div className='font-bold special text-dark-50 dark:text-light-50 text-base'>
          {value[0]}
          {' '}
          <span className="text-dark-50/70 dark:text-light-50/70 special">·</span>
          {' '}
          {value[1]}
        </div>
          )
        : <div className='font-bold special text-dark-50 dark:text-light-50 text-xl sm:text-base'>{value}</div>}
    </div>
  )
}

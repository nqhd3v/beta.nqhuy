// import { readFile, writeFile } from 'fs/promises'
// import { stravaActivities2Activities } from './mapping'
import dayjs from 'dayjs'
import { s2pace } from './mapping'

// const formatStravaActivity = async () => {
//   const dataStr = await readFile('./src/data/activities.json', { encoding: 'utf8' })
//   if (!dataStr) return
//   const data = JSON.parse(dataStr)
//   const formatted = stravaActivities2Activities(...data)
//   await writeFile(`./src/data/activities-formatted-${Date.now()}.json`, JSON.stringify(formatted), { encoding: 'utf8' })
// }
const date2DMYYYY = (date: Date) => dayjs(date).format('D/M/YYYY')
const date2MMMDYYYY = (date: Date) => dayjs(date).format('MMM D, YYYY')
const date2HmmA = (date: Date) => dayjs(date).format('H:mmA')
const roundNDec = (num: number, n = 2) => Math.round(num * (10 ^ n)) / (10 ^ n)
const runPace = (sec: number, meter: number) => {
  const p = s2pace(sec, meter)
  const m = Math.floor(p)
  const s = Math.floor((p - m) * 60)
  console.log(p, m, s)
  return `${m}:${s}`
}

export {
  // formatStravaActivity,
  date2DMYYYY,
  date2MMMDYYYY,
  date2HmmA,
  roundNDec,
  runPace
}

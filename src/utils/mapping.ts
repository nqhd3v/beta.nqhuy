import { tStravaActivity, tStravaActivityOrigin } from '@/types/strava'
import polyline from '@mapbox/polyline'

const polylinePoints2SVG = (polylineEncoded: string, size: [number, number] | number = 100) => {
  if (!polylineEncoded) {
    return {
      points: '',
      width: Array.isArray(size) ? Math.min(...size) : size,
      height: Array.isArray(size) ? Math.min(...size) : size
    }
  }
  const points = polyline.decode(polylineEncoded)
  // calculate coordinate range for a scale factor
  const xArr = points.map(val => val[0])
  const xMin = Math.min(...xArr)
  const xMax = Math.max(...xArr)
  const yArr = points.map(val => val[1])
  const yMin = Math.min(...yArr)
  const yMax = Math.max(...yArr)

  const xRange = xMax - xMin
  const yRange = yMax - yMin
  const scaleX = typeof size === 'number'
    ? size / Math.max(xRange, yRange)
    : size[0] / xRange
  const scaleY = typeof size === 'number'
    ? size / Math.max(xRange, yRange)
    : size[1] / yRange
  const scale = Math.min(scaleX, scaleY)

  // scale coordinates
  return {
    points: points.map(([x, y]) => {
      return [(x - xMin) * scale, (y - yMin) * scale].join(',')
    }).join(' '),
    width: xRange * scale,
    height: yRange * scale
  }
}
const stravaActivities2Activities = (...stravaActs: tStravaActivityOrigin[]): tStravaActivity[] => {
  return stravaActs.map(a => ({
    id: a.id,
    external_id: a.external_id,
    name: a.name,
    distance: a.distance,
    moving_time: a.moving_time,
    elapsed_time: a.elapsed_time,
    total_elevation_gain: a.total_elevation_gain,
    elev_high: a.elev_high,
    elev_low: a.elev_low,
    start_date: a.start_date,
    map: a.map.summary_polyline,
    average_heartrate: a.average_heartrate,
    max_heartrate: a.max_heartrate
  }))
}
const arr2Mapping = <T extends Record<string, any>>(arr: T[], key = 'id') => {
  const res: Record<string | number, T> = {}
  arr.forEach(arrItem => {
    const itemKey = arrItem[key]
    res[itemKey] = arrItem
  })
  return res
}
const s2Hm = (sec: number) => {
  console.log(sec)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h === 0 ? `${m}m` : `${h}h${m}`
}
const spm = (sec: number, meter: number) => sec / meter
const spm2pace = (spm: number) => spm * 1000 / 60
const s2pace = (sec: number, meter: number) => (sec / 60) / (meter / 1000)

export {
  polylinePoints2SVG,
  stravaActivities2Activities,
  arr2Mapping,
  s2Hm,
  spm,
  s2pace,
  spm2pace
}

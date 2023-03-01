import { DocumentId, tDataTransformed } from '@/types/firebase'
import { tStravaActivity, tStravaActivityOrigin } from '@/types/strava'
import polyline from '@mapbox/polyline'

import { Timestamp } from 'firebase/firestore'

// Firestore - Timestamp utils
export const date2FsTimestamp = (date?: Date) => Timestamp.fromDate(date || new Date())
export const fsTimestamp2Date = (timestamp: Timestamp): Date | undefined => timestamp ? timestamp.toDate() : undefined
export const fsArr2Dic = <T extends any>(arr: tDataTransformed<T>[]): Record<DocumentId, tDataTransformed<T>> => {
  const res: Record<DocumentId, tDataTransformed<any>> = {}
  arr.forEach(({ _id, ...data }) => {
    res[_id] = {
      ...data,
      _id
    }
  })
  return res
}
export const firstDataTransformedItem = <T extends any>(record: Record<DocumentId, tDataTransformed<T>>): tDataTransformed<T> | undefined => {
  if (Object.keys(record).length === 0) return undefined
  return record[Object.keys(record)[0]]
}
export const mapLength = (mapping: Record<string, any>, deep?: boolean): number => Object.keys(mapping).filter(k => {
  if (deep) {
    if (Array.isArray(mapping[k])) {
      return mapping[k].length > 0 ? mapping[k] : undefined
    }
    if (mapping[k] instanceof Object) {
      return mapLength(mapping[k], deep) > 0 ? mapping[k] : undefined
    }
  }
  return mapping[k]
}).length
export const boolRes = (f?: boolean, s?: boolean): boolean => f === undefined ? !!s : f

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

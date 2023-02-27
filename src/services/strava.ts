import { readFile } from 'fs/promises'
import * as path from 'path'

const addActivity = () => {
  return true
}
const getRaceInfo = async () => {
  try {
    const dataFolder = path.join(process.cwd(), 'json')
    const data = await readFile(dataFolder + '/race.json', { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (err) {
    console.error('Error when getting race from file:', err)
    return undefined
  }
}
const getActivities = async () => {
  try {
    const dataFolder = path.join(process.cwd(), 'json')
    const data = await readFile(dataFolder + '/activities.json', { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (err) {
    console.error('Error when getting activities from file:', err)
    return []
  }
}

export {
  addActivity,
  getActivities,
  getRaceInfo
}

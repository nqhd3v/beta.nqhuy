import { readFile } from 'fs/promises'

const addActivity = () => {
  return true
}
const getRaceInfo = async () => {
  try {
    console.log(process.cwd())
    const data = await readFile('./data/race.json', { encoding: 'utf8' })
    return JSON.parse(data)
  } catch (err) {
    console.error('Error when getting race from file:', err)
    return undefined
  }
}
const getActivities = async () => {
  try {
    console.log(process.cwd())
    const data = await readFile('./data/activities.json', { encoding: 'utf8' })
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

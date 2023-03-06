import fetchJS from './fetch-js'

const sendSlackMessage = (msg: string) => {
  const body = JSON.stringify({ text: msg })
  return fetch(
    process.env.SLACK_WEBHOOK as string,
    { method: 'POST', body }
  )
}
// Read more about slack block here:
// https://api.slack.com/reference/block-kit/blocks

const sendSlackBlocks = async (title: string, ...blocks: any[]) => {
  const body = JSON.stringify({
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title } },
      ...blocks.map(b => typeof b === 'object' ? b : ({ type: 'section', text: { type: 'mrkdwn', text: b } }))
    ]
  })
  try {
    const res = await fetchJS(
      process.env.SLACK_WEBHOOK as string,
      { method: 'POST', body }
    )
    return res
  } catch (err) {
    console.error('Error when send slack message with blocks:', err)
    return false
  }
}

export {
  sendSlackMessage,
  sendSlackBlocks
}

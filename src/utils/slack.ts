import fetchJS from './fetch-js'

const sendSlackMessage = (msg: string) => {
  const body = JSON.stringify({ text: msg })
  return fetch(
    process.env.SLACK_WEBHOOK as string,
    { method: 'POST', body }
  )
}

/**
 * NOTE: Your `text` must have max-length is 3000 character -> Cause error **invalid_blocks**
 *
 * ----
 * Read more about slack block here:
 * https://api.slack.com/reference/block-kit/blocks
 */
const sendSlackBlocks = async (
  title: string,
  ...blocks: any[]
): Promise<{ result: any; body: string; json: Record<string, any> }> => {
  const bodyJson = {
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: title } },
      ...blocks.map(b => typeof b === 'object' ? b : ({ type: 'section', text: { type: 'mrkdwn', text: b } }))
    ]
  }
  const body = JSON.stringify(bodyJson)
  try {
    const res = await fetchJS(
      process.env.SLACK_WEBHOOK as string,
      { method: 'POST', body }
    )
    return {
      result: res,
      body,
      json: bodyJson
    }
  } catch (err) {
    console.error('Error when send slack message with blocks:', err)
    return {
      result: false,
      body,
      json: bodyJson
    }
  }
}

export {
  sendSlackMessage,
  sendSlackBlocks
}

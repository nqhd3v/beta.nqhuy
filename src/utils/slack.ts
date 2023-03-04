const sendSlackMessage = (msg: string) => {
  const body = JSON.stringify({ text: msg })
  return fetch(
    process.env.SLACK_WEBHOOK as string,
    { method: 'POST', body }
  )
}
// Read more about slack block here:
// https://api.slack.com/reference/block-kit/blocks

const sendSlackBlocks = (title: string, ...blocks: any[]) => {
  const body = JSON.stringify({
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: `## ${title}` } },
      ...blocks
    ]
  })
  return fetch(
    process.env.SLACK_WEBHOOK as string,
    { method: 'POST', body }
  )
}

export {
  sendSlackMessage,
  sendSlackBlocks
}

import { RequestInit } from 'next/dist/server/web/spec-extension/request'

const fetchJS = async <T extends any>(input: string | Request, init?: RequestInit) => {
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type')
  if (contentType && contentType.indexOf('application/json') !== -1) {
    return (await res.json()) as T
  }
  return (await res.text()) as string
}

export default fetchJS

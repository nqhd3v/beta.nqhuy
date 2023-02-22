// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  isErr?: boolean,
  err?: any;
  data?: any;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log('Got strava-webhook callback:', req);
    res.send({ data: req })
  } catch (err) {
    res.status(400).send({ err });
  }
}

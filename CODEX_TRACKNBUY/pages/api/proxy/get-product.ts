import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { asin, url, domain = 'fr' } = req.query;
  const target = `${process.env.NEXT_PUBLIC_PROXY_URL}?asin=${asin || ''}&url=${url || ''}&domain=${domain}&api_key=${process.env.SCRAPINGDOG_API_KEY}`;
  const response = await fetch(target);
  const data = await response.json();
  res.status(200).json(data);
}

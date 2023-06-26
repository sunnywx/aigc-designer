import type { NextApiRequest, NextApiResponse } from 'next'
import properties from './properties';


// you can update it
interface Property {
  id: string | number;
  name: string;
  thumbnail: string;
  images: string[]
}

interface Result {
  properties: Property[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const result = properties.map(item => {
    const urls = item.images;
    const property = {
      id: item.id,
      name: item.name,
      thumbnail: item.thumbnail,
      images: urls.split('|')
    }
    return property;
  })
  // get properties
  res.status(200).json({ properties: result });
}
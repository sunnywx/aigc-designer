import type { NextApiRequest, NextApiResponse } from 'next'
import photos from './photos'
// you can update it
interface Photo {
  id: string | Number;
  url: string;
}

interface Result {
  photos: Photo[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  // get photos
  if(req.method?.toLowerCase() !== 'get'){
    return res.status(400).end('Bad request')
  }
  const result = photos.map(item => {
    const photo = {
      id: item.id,
      url: item.thumbnail
    }
    return photo;
  })
  res.status(200).json({ photos: result });
}
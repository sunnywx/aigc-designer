import type { NextApiRequest, NextApiResponse } from 'next'

// you can update it
interface Photo {
  id: string;
  name: string;
  url: string;
  listingPicturesUrl: string;
}

interface Result {
  photos: Photo[]
}

//const pics:Photo[] = 

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  // get photos
  res.status(200).json();
}
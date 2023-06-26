import type { NextApiRequest, NextApiResponse } from 'next'

// you can update it
interface Property {
  id: string;
  name: string;
  thumbnail: string;
  images: string[]
}

interface Result {
  properties: Property[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  // get properties
}
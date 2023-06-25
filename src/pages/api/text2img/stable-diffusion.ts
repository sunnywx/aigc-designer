import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method === "POST"){
    // todo
    res.end("use stable diffusion text2img api")
  }
  res.status(400).end("Bad request")
}
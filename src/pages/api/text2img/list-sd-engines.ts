import axios from 'axios'
import { NextApiRequest, NextApiResponse } from "next";

const apiHost = process.env.API_HOST ?? 'https://api.stability.ai'
const url = `${apiHost}/v1/engines/list`

const apiKey = process.env.STABLE_DIFFUSION_API_KEY

type Engine={
  id: string
  name: string
  description: string
  type: string
}

type Payload={
  result: Array<Engine>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== "GET"){
    return res.status(400).end("Bad request")
  }
  
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: "API key not configured",
      }
    });
  }
  
  try{
    const response = await axios.get(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    const payload = response.data as Payload
    // console.log('engines: ', payload)
    return res.json(payload)
  }catch (error){
    if (error.response) {
      res.status(error.response.status).json({error: error.response.data});
    } else {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

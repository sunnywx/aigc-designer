import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi, CreateImageRequestSizeEnum } from "openai";

const conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(conf);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if(req.method?.toLowerCase() !== 'post'){
    return res.status(400).end('Bad request')
  }
  
  if (!conf.apiKey) {
    return res.status(500).json({
      error: {
        message: "API key not configured",
      }
    });
  }
  
  const { p, size='256', count='1' } = req.body;
  try {
    const response = await openai.createImage({
      prompt: p,
      n: parseInt(count),
      size: `${size}x${size}` as CreateImageRequestSizeEnum,
    });
    res.status(200).json({result: response.data.data});
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({
        error: {
          message: error.message,
        }
      });
    }
  }
}
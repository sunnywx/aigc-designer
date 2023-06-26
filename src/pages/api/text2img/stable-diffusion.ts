import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';
const apiKey = process.env.STABLE_DIFFUSION_API_KEY;
const url = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    if (!apiKey) {
      return res.status(500).json({
        error: {
          message: "API key not configured",
        }
      });
    }
    // todo
    const { p, size = 512, count = 1, seed = 0, style } = req.body;
    const body = {
      text_prompts: [
        {
          text: p
        },
      ],
      cfg_scale: 7,
      clip_guidance_preset: 'FAST_BLUE',
      height: size,
      width: size,
      samples: count,
      steps: 30,
      seed,
    } as any;
    if (style) {
      body.style_preset = style;
    }
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      }
    }) as any;
    //response {result:[{base64: string,seed: number ,finishReason: string},...]}
    res.status(200).json({result: response.data.artifacts})
  } else {
    res.status(400).end("Bad request")
  }
}
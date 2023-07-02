import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

const apiKey = process.env.STABLE_DIFFUSION_API_KEY;
const url = 'https://api.stability.ai/v1/generation/stable-diffusion-v1-5/text-to-image';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(400).end("Bad request")
  }
  
  if (!apiKey) {
    return res.status(500).json({
      error: "API key not configured"
    });
  }
  
  try {
    // see: https://platform.stability.ai/rest-api#tag/v1generation/operation/textToImage
    const { p, size = 512, count = 1, seed = 0, style } = req.body;
    const body = {
      text_prompts: [
        {
          text: p,
          weight: 1
        },
      ],
      cfg_scale: 7, // 0 ~ 35
      clip_guidance_preset: 'FAST_BLUE',
      height: parseInt(size + ''), // minimal is 512
      width: parseInt(size + ''),
      sampler: "K_DPM_2_ANCESTRAL", // fixme
      samples: count,
      steps: 30,
      seed,
    } as any;
    if (style !== undefined) {
      body.style_preset = style;
    }
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
      }
    }) as any;
    res.status(200).json({ result: response.data.artifacts.map(({ base64 }) =>
        ({ url: `data:image/png;base64,${base64}` })) })
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({
        error: error.message
      });
    }
  }
}
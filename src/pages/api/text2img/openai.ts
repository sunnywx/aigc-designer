import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi, CreateImageRequestSizeEnum } from "openai";
import {HttpsProxyAgent} from "https-proxy-agent";
import axios from "axios";

const conf = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  // basePath: 'https://ai.fakeopen.com/api' // change chatgpt reverse proxy url
});

const openai = new OpenAIApi(conf);

// since chatgpt banned China, in some network situation(eg, outside office) will throw timeout
// so use http-proxy-agent
const proxy=process.env.HTTP_PROXY ? new HttpsProxyAgent(process.env.HTTP_PROXY) : null;

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
    }, proxy ? {
      proxy: false,
      httpAgent: proxy,
      httpsAgent: proxy
    } : {});
  
    // convert image url to base64 to prevent client side cors error
    const imgUrls=response.data.data.map(async ({url})=> {
      const {data}=await axios.get(url, {responseType: 'arraybuffer'})
      const b64=`data:image/png;base64,${data.toString('base64')}`
      return {url: b64}
    })
    res.status(200).json({result: await Promise.all(imgUrls)});
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
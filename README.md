AIGC designer
==

> AI powered brand/postcard designer

![demo output](./demo.png)

## Develop

```bash
git clone https://github.com/sunnywx/aigc-designer.git

# copy .env.example to .env
cp .env.example .env

yarn
yarn dev

# open browser, http://localhost:3777
```

**.env file configuration:**

- `OPENAI_API_KEY` is openai's API key
- `HTTP_PROXY` is your local http proxy config (For example, if you used `privoxy` or `polipo` to setup http proxy, this 
  configuration may be like `http://127.0.0.1:8118`), used on some network environment where can't 
  access openai's 
  service 
  directly (For example, China mainland). Leave it empty if your network can access `ChatGPT` directly.

## Build

Make `aigc-designer` as a standalone js package, then can easily
integrate it with other site/app.

```shell
yarn build
yarn start
```

## AI text-to-image models

- OpenAI text-to-image (default)
- Stable-Diffusion text-to-image (optional)

## Deploy

- Vercel (default)
- Docker-compose
- AWS serverless


## License
MIT

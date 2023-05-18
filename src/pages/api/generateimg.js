import { Configuration, OpenAIApi } from "openai";

const conf = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(conf);

export default async function (req, res) {
    if (!conf.apiKey) {
        res.status(500).json({
            error: {
                message: "API key not configured",
            }
        });
        return;
    }

    const description = req.body.description;
    try {
        const response = await openai.createImage({
            prompt: description,
            n: 1,
            size: "256x256",
        });
        const image_url = response.data.data[0].url;

        res.status(200).json({ result: image_url });
    } catch (error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}
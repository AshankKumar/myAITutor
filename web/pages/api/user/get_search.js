import clientPromise from "../../../lib/mongodb";
import {getServerSession} from "next-auth/next"
import {authOptions} from "pages/api/auth/[...nextauth]";

const weaviate = require("weaviate-client");
const OPEN_AI_KEY = "''"
const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
    apiKey: OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
const client = weaviate.client({
    scheme: "https",
    host: "chimpbase.weaviate.network",
    authClientSecret: new weaviate.AuthUserPasswordCredentials({
        username: "aryamanparekh12@gmail.com",
        password: "pBCjEiL6GGN5fjQ",
        scopes: ["offline_access"]  // optional, depends on the configuration of your identity provider (not required with WCS)
    }),
    headers: {
        "X-OpenAI-Api-Key": OPEN_AI_KEY
    }
});


async function getGPT3Answer(prompt) {

    try {
        const model = 'text-davinci-003';
        const temperature = 0.5;
        const maxTokens = 300;
        const n = 1;
        const stop = '\n';

        const response = await openai.createCompletion({
            model: model,
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.5
        });
        const output = response.data.choices[0].text.trim();
        return output;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getClassName = (key) => {
    return `Document_${key.replaceAll('-', '_')}`
}

const requestHandler = async (req, res) => {
    if (req.method === "GET") {
        const {query, key} = req.query
        console.log(key)

        const className = getClassName(key)
        let weaviateRes = await client.graphql
            .get()
            .withClassName(className)
            .withFields('text')
            .withLimit(2)
            .do()
        const matchingText = weaviateRes.data.Get[className]
        let prompt = "Answer the question as truthfully as possible and in detail using the provided context, and if the answer is not contained within the text below, say 'I don't know.'\n\nContext:\n"
        for (let i = 0; i < matchingText.length; i++) {
            prompt += '\n' + matchingText[i].text + '\n'
        }
        console.log(prompt)

        prompt += `Q:${query}` + "\nA:"
        getGPT3Answer(prompt).then(answer => {
            console.log(answer)
            return res.status(200).json({'answer': answer})
        })

        // return res.status(200).json({s3Url: ''})
    } else {
        return res.status(404).json({message: "URL Not Found"});
    }
};

export default requestHandler;
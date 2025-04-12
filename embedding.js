import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function embed(input) {
    const response = await axios
        .post(
            "https://api.openai.com/v1/embeddings",
            {
                model: "text-embedding-3-large",
                input,
            },
            { headers: { Authorization: `Bearer ${process.env["OPEN_AI_TOKEN"]}` } }
        )
        .then((response) => response.data.data[0].embedding);
    return response;
}

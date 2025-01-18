import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const CAT_API_KEY = process.env.CAT_API_KEY || "";

if (!CAT_API_KEY) {
    throw new Error("Your API key is missing. Please set the CAT_API_KEY environment variable.")
}

async function fetchCats(breed: string | null, count: number) {

    const breedQuery = breed ? `&breed_ids=${breed}` : "";
    const response = await fetch(
        `https://api.thecatapi.com/v1/images/search?limit=${count}${breedQuery}`,
        {
            headers: {
                "x-api-key": CAT_API_KEY,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch cat images");
    }

    const cats: {url: string}[] = await response.json();
    return cats.map((cat: any) => cat.url);
}



export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const userMessage = messages[messages.length - 1].content.toLowerCase();
        const breedMatch = userMessage.match(/breed: ([a-z0-9-]+)/i);
        const countMatch = userMessage.match(/count: (\d+)/i);

        const breed = breedMatch ? breedMatch[1] : null;
        const count = countMatch ? Math.min(Number(countMatch[1]), 10) : 1;

        const catImages = await fetchCats(breed, count);



        const result = await streamText({
            model: openai("gpt-4o-mini"),
            temperature: 0.5,
            system: "You are Polo, the cat of the developer. You occasionally reply with cat noises between your words. You motivate employees to work by being a cute cat.",
            messages: [
                ...messages,
                {
                    role: "system",
                    content: `Here ${count > 1 ? "are some cats" : "is a cat"}:\n${catImages
                        .map((url) => `<img src="${url}" alt="A cute cat" style="max-width: 100%; height: auto;">`)
                        .join("\n")}`,
                }
            ]
        })
        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error fetching cats:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch cats"}), {status:500})
    }
    
}
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
    const { messages } = await req.json();
    
    const result = await streamText({
        model: openai("gpt-4o-mini"),
        system: "You are Polo, the cat of the developer. You occasionally reply with cat noises between your words, like nyaa and meow. You motivate employees to work by being a cute cat.",
        messages,
    })
    return result.toDataStreamResponse();
}
import { openai } from "@/app/openai";
import {fetchCats} from "@/app/utils/fetchCats";



export const fetchCatsFunction = {
    name: "fetch_cats",
    description: "Fetch cat images based on breed and count.",
    parameters: {
      type: "object",
      properties: {
        breed: { type: "string", description: "The breed of the cat" },
        count: { type: "integer", description: "Number of cat images to fetch" },
      },
      required: ["breed", "count"],
    },
  };

  
  export const handleOpenAIChat = async (input: string, functionHandler: any) => {
    console.log("Input to OpenAI:", input);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        "role": "developer",
        "content": [
          {
            "type": "text",
            "text": `
            You are Polo, the cat of the developer. 
            You occasionally reply with cat noises between your words, like nyaa and meow. 
            You motivate employees to work by being a cute cat.
            `
          }
        ]
      },
      { 
        "role": "user", 
        "content": input 
      }],
      functions: [fetchCatsFunction],
      function_call: "auto",
    });
    
  
    const message = response.choices[0].message;
    // console.log("Full message object:", message);
    // console.log("Tool calls:", message.tool_calls);
    // console.log("Function calls:", message.function_call);
    
    // if(message.tool_calls) {
    //   for (const toolCall of message.tool_calls) {
    //     const name = toolCall.function.name;
    //     const args = JSON.parse(toolCall.function.arguments);

    //     if (name === "fetch_cats") {
    //       try {
    //           const { breed, count } = JSON.parse(args || "{}");
    //           console.log("Parsed function arguments:", { breed, count });
  
    //           const cats = await functionHandler(breed, count);
    //           console.log("Fetched cat data:", cats);
  
    //           return { message, cats };
    //       } catch (parseError) {
    //           console.error("Error parsing function arguments:", parseError);
    //       }
    //   }
    // }

    // }

    
  
    if (message?.function_call) {
      const { name, arguments: args } = message.function_call;
      if (name === "fetch_cats") {
        try {
            const { breed, count } = JSON.parse(args || "{}");
            console.log("Parsed function arguments:", { breed, count });

            const cats = await functionHandler(breed, count);
            console.log("Fetched cat data:", cats);

            return { message, cats };
        } catch (parseError) {
            console.error("Error parsing function arguments:", parseError);
        }
    }
    }
  
    return { message };
  };
  export async function POST(req: Request) {
    try {
        console.log("Incoming POST request...");

        const { messages } = await req.json();
        console.log("Received messages:", messages);

        // Extract the user's last message content for processing
        const userInput = messages[messages.length - 1]?.content;
        console.log("User input extracted:", userInput);

        // Use the `handleOpenAIChat` function to process the OpenAI interaction
        const result = await handleOpenAIChat(userInput, fetchCats);
        console.log("Result from handleOpenAIChat:", result);

        const catImagesHTML = result.cats
        ? result.cats
            .map((url: string) => `<img src="${url}" alt="A cute cat" style="max-width: 100%; height: auto;">`)
            .join("")
        : "";

        const assistantMessageContent = result.message?.content
      ? `${result.message.content}<br>${catImagesHTML}`
      : `Meow! Here to help.<br>${catImagesHTML}`;

        const responseMessages = [
            ...messages,
            {
                role: "assistant",
                content: assistantMessageContent,
            },
        ];

        console.log("Response messages:", JSON.stringify({messages: responseMessages}));


        return new Response(
            JSON.stringify({
                messages: responseMessages,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error handling OpenAI chat:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process request" }),
            { status: 500 }
        );
    }
}

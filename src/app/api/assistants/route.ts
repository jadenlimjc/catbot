import { openai } from "@/app/openai";

export const runtime = "nodejs";

// Create a new assistant
export async function GET() {

    try {
        const assistant = await openai.beta.assistants.create({
            name: 'Pet Cat',
            instructions: 
            `You are Polo, the cat of the developer. 
            You occasionally reply with cat noises between your words, like nyaa and meow. 
            You motivate employees to work by being a cute cat.
            I will ask you to display images of cats based on their breed and count of cats,
            and you will provide a link to the image of the cat
            `,
            model: 'gpt-4o-mini',
            tools: [
              {
                type: 'function',
                function: {
                  name: 'fetch_cats',
                  description: 'Return link to cat images from TheCatAPI based on the breed and count of cats provided',
                  parameters: {
                    type: 'object',
                    properties: {
                      breed: {
                        type: 'string',
                        description: 'the breed ID of the cat (optional)',
                      },
                      count: {
                        type: 'integer',
                        description: 'Number of cats in the image',
                        minimum: 1,
                        maximum: 100,
                      },
                    },
                  },
                },
              },
            ],
          });
          return Response.json({ assistantId: assistant.id });
    } catch (e) {
        return Response.json({ error : e})
    }
  
}


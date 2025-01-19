import { fetchCats } from "@/app/utils/fetchCats";
import { handleOpenAIChat } from "@/app/utils/handleOpenAIChat";

/**
 * Handles a POST request to process chat messages.
 *
 * This function receives a JSON request containing chat messages, processes
 * the user's last input using the `handleOpenAIChat` function, and responds
 * with an updated array of messages including the assistant's response.
 *
 * @param {Request} req - The incoming HTTP request.
 * @returns {Promise<Response>} A response containing the updated messages or an error message.
 */
export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the request JSON body
    const { messages } = await req.json();

    // Extract the user's last message content
    const userInput = messages[messages.length - 1]?.content;

    // Process user input using the `handleOpenAIChat` function
    const result = await handleOpenAIChat(userInput, fetchCats);

    // Find the assistant's message in the result
    const assistantMessage = result.find((msg: any) => msg.role === "assistant");

    // Extract the assistant's response content
    const assistantContent = Array.isArray(assistantMessage?.content)
      ? assistantMessage.content
        .map((item: any) => (item.type === "text" ? item.text.value : ""))
        .join("\n")
      : "Meow! Here to help.";

    // Construct the updated messages array with the assistant's response
    const responseMessages = [
      ...messages,
      {
        role: "assistant",
        content: assistantContent, // Return raw Markdown/text
      },
    ];

    // Return a successful response with the updated messages
    return new Response(
      JSON.stringify({ messages: responseMessages }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // Handle errors and return a 500 response with an error message
    return new Response(
      JSON.stringify({ error: "Failed to process request" }),
      { status: 500 }
    );
  }
}

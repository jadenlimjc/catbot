import { fetchCats } from "@/app/utils/fetchCats";
import { handleOpenAIChat } from "@/app/utils/handleOpenAIChat";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    console.log("Received messages:", messages);

    // Extract the user's last message content
    const userInput = messages[messages.length - 1]?.content;
    console.log("User input extracted:", userInput);

    // Process user input using the `handleOpenAIChat` function
    const result = await handleOpenAIChat(userInput, fetchCats);
    console.log("Result from handleOpenAIChat:", result);

    // Find the assistant's message
    const assistantMessage = result.find((msg: any) => msg.role === "assistant");
    const assistantContent = Array.isArray(assistantMessage?.content)
      ? assistantMessage.content.map((item: any) => (item.type === "text" ? item.text.value : "")).join("\n")
      : "Meow! Here to help.";

    console.log("Assistant content:", assistantContent);

    const responseMessages = [
      ...messages,
      {
        role: "assistant",
        content: assistantContent, // Return raw Markdown/text
      },
    ];

    console.log("Response messages:", JSON.stringify({ messages: responseMessages }));
    return new Response(
      JSON.stringify({ messages: responseMessages }),
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

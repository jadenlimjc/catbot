import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { initialiseThread } from "./initialiseThread";

const handleRequiresAction = async (
    run: any,
    threadId: string,
    functionHandler: any
  ): Promise<any> => {
    if (
      run.required_action &&
      run.required_action.submit_tool_outputs &&
      run.required_action.submit_tool_outputs.tool_calls
    ) {
      const toolCalls = run.required_action.submit_tool_outputs.tool_calls;
  
      console.log("Tool calls received:", toolCalls);
  
      const toolOutputs = await Promise.all(
        toolCalls.map(async (tool: any) => {
          console.log("Processing tool:", tool.function.name);
  
          if (tool.function.name === "get_cats") {
            try {
              const args = JSON.parse(tool.function.arguments || "{}");
              console.log("Parsed arguments for get_cats:", args);
  
              const { breed, count } = args;
  
              // Call the function handler (fetchCats)
              const cats = await functionHandler(breed, count);
  
              if (cats && cats.length > 0) {
                console.log("Fetched cat data:", cats);
                return {
                  tool_call_id: tool.id,
                  output: JSON.stringify(cats), // Return the fetched data
                };
              } else {
                console.warn("fetchCats returned no data.");
              }
            } catch (error) {
              console.error("Error handling get_cats function:", error);
            }
          } else {
            console.warn(`Unhandled tool function: ${tool.function.name}`);
          }
        })
      );
  
      // Filter out undefined tool outputs
      const validToolOutputs = toolOutputs.filter(Boolean);
  
      if (validToolOutputs.length > 0) {
        run = await openai.beta.threads.runs.submitToolOutputsAndPoll(
          threadId,
          run.id,
          { tool_outputs: validToolOutputs }
        );
        console.log("Tool outputs submitted successfully.");
      } else {
        console.warn("No valid tool outputs to submit. Exiting the loop to prevent infinite recursion.");
        return run; // Exit to avoid infinite recursion
      }
  
      return handleRunStatus(run, threadId, functionHandler);
    } else {
      console.warn("No required actions found.");
      return run; // Exit if no required actions
    }
  };
  
  const handleRunStatus = async (run: any, threadId: string, functionHandler: any) => {
    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      return messages.data;
    } else if (run.status === "requires_action") {
      console.log("Run requires action");
      return await handleRequiresAction(run, threadId, functionHandler);
    } else {
      console.error("run did not complete:", run);
      throw new Error("run did not complete succesfully.")
    }
  }
  
  
  
  export const handleOpenAIChat = async (input: string, functionHandler: any) => {
    console.log("Input to OpenAI:", input);
  
    const threadId = await initialiseThread();
  
    await openai.beta.threads.messages.create(
      threadId,
      {
        role: "user",
        content: input,
      }
    );
  
  
    let run = await openai.beta.threads.runs.createAndPoll(
      threadId,
      {
        assistant_id: assistantId,
      }
    );
    return await handleRunStatus(run, threadId, functionHandler);
  };
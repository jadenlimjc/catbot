import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { initialiseThread } from "./initialiseThread";

/**
 * Handles actions required by the OpenAI thread, such as processing tool calls.
 *
 * @param run - The current thread run object.
 * @param threadId - The unique identifier for the thread.
 * @param functionHandler - A function to handle specific tool functionality (e.g., fetchCats).
 * @returns The updated run object after processing required actions.
 */
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

      const toolOutputs = await Promise.all(
        toolCalls.map(async (tool: any) => {
          if (tool.function.name === "get_cats") {
            try {
              const args = JSON.parse(tool.function.arguments || "{}");
              const { breed, count } = args;

              // Call the function handler (fetchCats)
              const cats = await functionHandler(breed, count);

              if (cats && cats.length > 0) {
                return {
                  tool_call_id: tool.id,
                  output: JSON.stringify(cats), // Return the fetched data
                };
              }
            } catch (error) {
              throw new Error(`Error handling get_cats function: ${error}`);
            }
          } else {
            throw new Error(`Unhandled tool function: ${tool.function.name}`);
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
      } else {
        return run; // Exit to avoid infinite recursion
      }

      return handleRunStatus(run, threadId, functionHandler);
    } else {
      return run; // Exit if no required actions
    }
  };

/**
 * Handles the status of a thread run, determining the next steps based on the run's status.
 *
 * @param run - The current thread run object.
 * @param threadId - The unique identifier for the thread.
 * @param functionHandler - A function to handle specific tool functionality (e.g., fetchCats).
 * @returns The messages from the completed thread run.
 */
const handleRunStatus = async (
  run: any,
  threadId: string,
  functionHandler: any
) => {
  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data;
  } else if (run.status === "requires_action") {
    return await handleRequiresAction(run, threadId, functionHandler);
  } else {
    throw new Error("run did not complete successfully.");
  }
};

/**
 * Handles the OpenAI chat flow, including initializing a thread, sending a user message,
 * and processing the thread run until completion.
 *
 * @param input - The user input to be processed by the assistant.
 * @param functionHandler - A function to handle specific tool functionality (e.g., fetchCats).
 * @returns The messages from the completed thread run.
 */
export const handleOpenAIChat = async (
  input: string,
  functionHandler: any
) => {
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

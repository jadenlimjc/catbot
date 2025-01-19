import { openai } from "@/app/openai";

let sharedThreadId: string | null = null;

export const initializeThread = async () => {
  if (!sharedThreadId) {
    const thread = await openai.beta.threads.create();
    sharedThreadId = thread.id;
    console.log("Thread created with ID:", sharedThreadId);
  }
  return sharedThreadId;
};
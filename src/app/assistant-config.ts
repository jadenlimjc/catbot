export let assistantId = ""; 

if (process.env.OPENAI_ASSISTANT_ID) {
    assistantId = process.env.OPENAI_ASSISTANT_ID;
  }

// Step 3: Define model node

import { SystemMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import type { GraphNode } from "@langchain/langgraph";
import type { MessagesState } from "./state";
import { modelWithTools, toolsByName, type ToolName } from "./model";

export const llmCall: GraphNode<typeof MessagesState> = async (state) => {
  return {
    messages: [await modelWithTools.invoke([
      new SystemMessage(
        "You are a helpful assistant tasked with performing arithmetic on a set of inputs."
      ),
      ...state.messages,
    ])],
    llmCalls: 1,
  };
};

// Step 4: Define tool node

export const toolNode: GraphNode<typeof MessagesState> = async (state) => {
  const lastMessage = state.messages.at(-1);

  if (lastMessage == null || !AIMessage.isInstance(lastMessage)) {
    return { messages: [] };
  }

  const result: ToolMessage[] = [];
  for (const toolCall of lastMessage.tool_calls ?? []) {
    const tool = toolsByName[toolCall.name as ToolName];
    const observation = await tool.invoke(toolCall);
    result.push(observation);
  }

  return { messages: result };
};
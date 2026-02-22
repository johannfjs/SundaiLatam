// Step 5: Define logic to determine whether to end
import { AIMessage } from "@langchain/core/messages";
import { type ConditionalEdgeRouter, END } from "@langchain/langgraph";
import type { MessagesState } from "./state";

export const shouldContinue: ConditionalEdgeRouter<typeof MessagesState,any, "toolNode"> = (state) => {
  const lastMessage = state.messages.at(-1);

  // Check if it's an AIMessage before accessing tool_calls
  if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
    return END;
  }

  // If the LLM makes a tool call, then perform an action
  if (lastMessage.tool_calls?.length) {
    return "toolNode";
  }

  // Otherwise, we stop (reply to the user)
  return END;
};
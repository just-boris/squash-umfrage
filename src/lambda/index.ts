import { EventBridgeEvent } from "aws-lambda";
import { SquashEvent } from "../interfaces.js";

const base = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;

export default async function handler({ detail }: EventBridgeEvent<string, SquashEvent>) {
  const poll = await request("sendPoll", {
    chat_id: detail.chatId,
    question: detail.poll.question,
    options: detail.poll.options,
    is_anonymous: false,
    allows_multiple_answers: false,
  });
  console.log("poll", poll);
  for (const forwardTo of detail.forwardChatId) {
    const forwarded = await request("forwardMessage", {
      chat_id: forwardTo,
      from_chat_id: detail.chatId,
      message_id: poll.message_id,
    });
    console.log("forwarded message", forwarded);
  }
}

async function request(path: string, data: Record<string, any>) {
  const response = await fetch(new URL(path, base), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const content = await response.text();
    throw new Error(content);
  }
  const json = await response.json();
  if (json.ok) {
    return json.result;
  }
}

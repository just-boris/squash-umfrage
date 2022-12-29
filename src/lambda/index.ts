import { SquashEvent } from "../interfaces.js";
import { getLastMessage, setLastMessage } from "./ssm.js";
import { errorToString, prettyPrint } from "./utils.js";

const base = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;

export async function handler(event: SquashEvent) {
  try {
    await sendMessages(event);
  } catch (error) {
    try {
      await request("sendMessage", { chat_id: 941870, text: errorToString(error) });
    } catch {
      throw error;
    }
  }
}

async function sendMessages(event: SquashEvent) {
  const lastPollId = await getLastMessage(event.chatId);
  if (lastPollId) {
    await request("unpinChatMessage", { chat_id: event.chatId, message_id: lastPollId });
  }
  const poll = await request("sendPoll", {
    chat_id: event.chatId,
    question: event.poll.question,
    options: event.poll.options,
    is_anonymous: false,
    allows_multiple_answers: false,
  });
  await request("pinChatMessage", { chat_id: event.chatId, message_id: poll.message_id, disable_notification: false });
  await setLastMessage(event.chatId, poll.message_id);
  console.log("poll");
  console.log(prettyPrint(poll));
  for (const forwardTo of event.forwardChatId) {
    const forwarded = await request("forwardMessage", {
      chat_id: forwardTo,
      from_chat_id: event.chatId,
      message_id: poll.message_id,
    });
    await request("pinChatMessage", {
      chat_id: forwardTo,
      message_id: forwarded.message_id,
      disable_notification: false,
    });
    await setLastMessage(forwardTo, forwarded.message_id);
    console.log("forwarded message");
    console.log(prettyPrint(forwarded));
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
  if (!json.ok) {
    throw new Error("Unexpected response: " + prettyPrint(json));
  }
  return json.result;
}

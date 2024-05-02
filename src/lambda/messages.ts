import { SquashEvent } from "../interfaces.js";
import { getLastMessage, setLastMessage } from "./ssm.js";
import { formatMessage, prettyPrint } from "./utils.js";

const base = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;

async function unpinLastIfExists(chatId: number) {
  try {
    const lastPollId = await getLastMessage(chatId);
    if (lastPollId) {
      await request("unpinChatMessage", { chat_id: chatId, message_id: lastPollId });
    }
  } catch {
    // skip if it does not work
  }
}

async function pinAndSave(chatId: number, messageId: number) {
  await request("pinChatMessage", { chat_id: chatId, message_id: messageId, disable_notification: true });
  await setLastMessage(chatId, messageId);
}

export async function sendMessages(event: SquashEvent) {
  await unpinLastIfExists(event.chatId);
  const poll = await request("sendPoll", {
    chat_id: event.chatId,
    question: formatMessage(event.poll.question),
    options: event.poll.options,
    is_anonymous: false,
    allows_multiple_answers: event.poll.options.length > 2,
  });
  await pinAndSave(event.chatId, poll.message_id);
  console.log("poll");
  console.log(prettyPrint(poll));
  for (const forwardTo of event.forwardChatId) {
    await unpinLastIfExists(forwardTo);
    const forwarded = await request("forwardMessage", {
      chat_id: forwardTo,
      from_chat_id: event.chatId,
      message_id: poll.message_id,
    });
    await pinAndSave(forwardTo, forwarded.message_id);
    console.log("forwarded message");
    console.log(prettyPrint(forwarded));
  }
}

export async function stopPoll(event: SquashEvent) {
  const lastPollId = await getLastMessage(event.chatId);
  const poll = await request("stopPoll", {
    chat_id: event.chatId,
    message_id: lastPollId,
  });
  console.log("poll");
  console.log(prettyPrint(poll));
}

export async function request(path: string, data: Record<string, any>) {
  console.log("CALL", path, data);
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

import { SquashEvent } from "../interfaces";

const base = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/`;

export default async function handler(event: SquashEvent) {
  const poll = await request("sendPoll", {
    chat_id: event.chatId,
    question: event.poll.question,
    options: event.poll.options,
    is_anonymous: false,
    allows_multiple_answers: false,
  });
  console.log("poll", poll);
  const forward = await request("forwardMessage", {
    chat_id: event.forwardChatId,
    from_chat_id: event.chatId,
    message_id: poll.message_id,
  });
  console.log("forwarded message", forward);
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

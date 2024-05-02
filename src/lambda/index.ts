import { SquashEvent } from "../interfaces.js";
import { request, sendMessages, stopPoll } from "./messages.js";
import { errorToString } from "./utils.js";

async function reportError(error: unknown) {
  await request("sendMessage", { chat_id: 941870, text: errorToString(error) });
}

export async function sendPollHandler(event: SquashEvent) {
  try {
    await sendMessages(event);
  } catch (error) {
    try {
      await reportError(error);
    } catch {
      throw error;
    }
  }
}

export async function stopPollHandler(event: SquashEvent) {
  try {
    await stopPoll(event);
  } catch (error) {
    try {
      await reportError(error);
    } catch {
      throw error;
    }
  }
}

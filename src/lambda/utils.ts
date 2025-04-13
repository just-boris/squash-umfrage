import { applyDuration } from "./duration.js";

export function prettyPrint(json: any) {
  return JSON.stringify(json, null, 2);
}

export function errorToString(error: unknown) {
  if (error instanceof Error && error.stack) {
    return error.stack;
  }
  return String(error);
}

export function formatMessage(message: string) {
  let result = message.replace(/%(\S+)%/g, (_, exp) => {
    const date = applyDuration(new Date(), exp);
    return `${date.getDate()}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  });

  if (result.includes("20.04")) {
    // special Easter schedule
    result = result.replace("20.04", "21.04").replace("воскресенье", "понедельник");
  }

  return result;
}

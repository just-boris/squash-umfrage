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
  return message.replace(/%DAY\+(\d+)%/g, (_, shift) => {
    const now = new Date();
    now.setDate(now.getDate() + parseFloat(shift));
    return `${now.getDate()}.${(now.getMonth() + 1).toString().padStart(2, "0")}`;
  });
}

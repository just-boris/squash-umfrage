export function prettyPrint(json: any) {
  return JSON.stringify(json, null, 2);
}

export function errorToString(error: unknown) {
  if (error instanceof Error && error.stack) {
    return error.stack;
  }
  return String(error);
}

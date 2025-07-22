export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function isErrorWithMessage(error: unknown): error is Error {
  return error instanceof Error;
} 
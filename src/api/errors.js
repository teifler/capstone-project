// One error type for everything that can go wrong while loading data, so the
// UI can show a specific, friendly message without inspecting raw errors.
//
// kind: 'rate-limit' | 'unreachable' | 'offline' | 'timeout' | 'http' |
//       'parse' | 'abort'
export class ApiError extends Error {
  constructor(
    kind,
    message,
    { status = null, retryAfterMs = null, cause } = {}
  ) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.retryAfterMs = retryAfterMs;
  }
}

// Errors worth retrying automatically after a pause.
export function isRetryable(error) {
  return (
    error instanceof ApiError &&
    (error.kind === 'rate-limit' || error.kind === 'unreachable') &&
    typeof error.retryAfterMs === 'number'
  );
}

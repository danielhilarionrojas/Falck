export interface ApiError {
  readonly status: number;
  readonly message: string;
  readonly url: string | null;
  readonly cause: unknown;
}

export const isApiError = (value: unknown): value is ApiError =>
  typeof value === 'object' &&
  value !== null &&
  'status' in value &&
  'message' in value;

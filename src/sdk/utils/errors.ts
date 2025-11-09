
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status = 500, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends Error {
  details: unknown;
  constructor(message: string, details: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
  }
}

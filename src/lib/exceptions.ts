export abstract class BaseError extends Error {
  public statusCode: number;
  constructor(name: string, message: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends BaseError {
  constructor(
    message = "Invalid request. Please check your input and try again.",
  ) {
    super("BadRequestError", message, 400);
  }
}

export class AuthRequiredError extends BaseError {
  constructor(
    message = "You need to sign in to continue. Please log in and retry.",
  ) {
    super("AuthRequiredError", message, 401);
  }
}

export class SessionExpiredError extends BaseError {
  constructor(message = "Your session has expired. Please log in again.") {
    super("SessionExpiredError", message, 401);
  }
}

export class PaymentRequiredError extends BaseError {
  constructor(
    message = "Payment required to use this feature. Please update your plan.",
  ) {
    super("PaymentRequiredError", message, 402);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(
    message = "You don’t have permission to access this resource. " +
      "If you believe this is an error, contact support.",
  ) {
    super("UnauthorizedError", message, 403);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = "The requested resource could not be found.") {
    super("NotFoundError", message, 404);
  }
}

export class FolderNotFoundError extends BaseError {
  constructor(
    message = "The specified folder was not found or has been removed.",
  ) {
    super("FolderNotFoundError", message, 404);
  }
}

export class ValidationError extends BaseError {
  constructor(message = "Some fields are invalid. Please review your input.") {
    super("ValidationError", message, 422);
  }
}

export class ConflictError extends BaseError {
  constructor(
    message = "Conflict detected. The resource has been modified elsewhere.",
  ) {
    super("ConflictError", message, 409);
  }
}

export class RateLimitError extends BaseError {
  constructor(
    message = "Too many requests. Please wait a moment and try again.",
  ) {
    super("RateLimitError", message, 429);
  }
}

export class FileUploadError extends BaseError {
  constructor(
    message = "File upload failed. Check file size/format and retry.",
  ) {
    super("FileUploadError", message, 400);
  }
}

export class ConnectionError extends BaseError {
  constructor(
    message = "Network error. Please check your connection and try again.",
  ) {
    super("ConnectionError", message, 503);
  }
}

export class DatabaseError extends BaseError {
  constructor(
    message = "We’re having trouble fetching data. Please try again later.",
  ) {
    super("DatabaseError", message, 500);
  }
}

export class ThirdPartyServiceError extends BaseError {
  constructor(message = "An external service failed. Please try again later.") {
    super("ThirdPartyServiceError", message, 502);
  }
}

export class InternalServerError extends BaseError {
  constructor(
    message = "Oops! Something went wrong on our end. Please try again later.",
  ) {
    super("InternalServerError", message, 500);
  }
}

export class ServiceUnavailableError extends BaseError {
  constructor(
    message = "Service is temporarily unavailable. Please check back soon.",
  ) {
    super("ServiceUnavailableError", message, 503);
  }
}

export class TimeoutError extends BaseError {
  constructor(message = "Request timed out. Check your connection and retry.") {
    super("TimeoutError", message, 504);
  }
}

export class MaintenanceModeError extends BaseError {
  constructor(
    message = "The site is under maintenance. We’ll be back shortly.",
  ) {
    super("MaintenanceModeError", message, 503);
  }
}

export class FeatureDisabledError extends BaseError {
  constructor(
    message = "This feature is currently unavailable. Please try another action.",
  ) {
    super("FeatureDisabledError", message, 403);
  }
}

export class OnboardingError extends BaseError {
  constructor(
    message = "Onboarding process failed. Please try again later or contact us.",
  ) {
    super("OnboardingError", message, 500);
  }
}

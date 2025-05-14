export class AuthRequiredError extends Error {
  constructor(message: "You must be logged in to access this resource") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export class DatabaseError extends Error {
  constructor(
    message: "Database error. We’re working on it. Please try again later.",
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class ConnectionError extends Error {
  constructor(
    message: "Connection error. We’re working on it. Please try again later.",
  ) {
    super(message);
    this.name = "ConnectionError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message: "You are not authorized to access this resource") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends Error {
  constructor(message: "The resource you are looking for does not exist") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class BadRequestError extends Error {
  constructor(message: "Bad request. Please try again.") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class InternalServerError extends Error {
  constructor(message: "Internal server error. Please try again later.") {
    super(message);
    this.name = "InternalServerError";
  }
}

export class OnboardingError extends Error {
  constructor(
    message: "Onboarding error. We’re working on it. Please try again later.",
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}

export class FolderNotFoundError extends Error {
  constructor(message: "Folder not found") {
    super(message);
    this.name = "FolderNotFoundError";
  }
}

export class PopupAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PopupAuthError";
  }
}

export class PopupBlockedError extends PopupAuthError {
  constructor() {
    super("Popup was blocked by the browser");
    this.name = "PopupBlockedError";
  }
}

export class UserCancelledError extends PopupAuthError {
  constructor() {
    super("User cancelled the authentication flow");
    this.name = "UserCancelledError";
  }
}

export class PopupTimeoutError extends PopupAuthError {
  constructor() {
    super("Popup authentication timed out");
    this.name = "PopupTimeoutError";
  }
}

export class PopupUnknownError extends PopupAuthError {
  constructor(message?: string) {
    super(message || "Unknown popup authentication error");
    this.name = "PopupUnknownError";
  }
}

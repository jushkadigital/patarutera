export type AuthPopupStatus = "success" | "error";

export interface AuthPopupMessage {
  type: "auth-popup";
  status: AuthPopupStatus;
  nonce: string;
  error?: string;
}

export interface PopupConfig {
  width: number;
  height: number;
  name: string;
  features?: string;
}

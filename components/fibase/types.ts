export type AppState = "IDLE" | "PROCESSING" | "CHAT";

export interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  isEmergency?: boolean;
  actionRequired?: "CALL_BANK" | "NONE";
  steps?: string[];
}

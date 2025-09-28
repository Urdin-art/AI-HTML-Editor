
export enum AppView {
  HOME,
  EDITOR,
}

export enum MessageAuthor {
  USER = 'user',
  GEMINI = 'gemini',
  SYSTEM = 'system',
}

export interface ChatMessage {
  author: MessageAuthor;
  content: string;
}

export enum GeminiModel {
  PRO = 'gemini-pro',
  FLASH = 'gemini-2.5-flash',
}

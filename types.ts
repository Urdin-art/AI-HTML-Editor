
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

export interface FileItem {
  name: string;
  path: string;
  type: 'resource' | 'creation';
}

export enum GeminiModel {
  PRO = 'gemini-1.0-pro',
  FLASH = 'gemini-flash',
}

// inspired by aether/aero

import Message from "./Message";

export default class MessageUtil {
  static encode(message: Message): string {
    return JSON.stringify(message);
  }
  static decode(message: string): Message | null {
    const parsed = JSON.parse(message);
    if (typeof parsed.type !== "number") {
      return null;
    }
    return new Message(parsed.type, parsed.data);
  }
}

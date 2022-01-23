import IMessage, { MessageTypes } from "../interfaces/IMessage";

export default class Message implements IMessage {
  constructor(
    public type: MessageTypes,
    public data: Record<string, unknown>
  ) {}

  toJSON(): Record<string, unknown> {
    return {
      type: this.type,
      data: this.data,
    };
  }
}

export enum MessageTypes {
  Ping,
  Pong,
  Identify,
  Position,
  SetPosition,
}

interface IMessage {
  type: MessageTypes;
  data?: Record<string, unknown>;
}

export default IMessage;

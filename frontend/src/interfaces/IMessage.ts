export enum MessageTypes {
  Ping,
  Pong,
  Identify,
  GetPlayhead,
  SetPlayhead,
}

interface IMessage {
  type: MessageTypes;
  data?: Record<string, unknown>;
}

export default IMessage;

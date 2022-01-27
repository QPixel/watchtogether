export enum MessageTypes {
  Ping,
  Pong,
  Identify,
  GetPlayhead,
  SetPlayhead,
}

interface IMessage {
  type: MessageTypes;
  data?: unknown;
}

export default IMessage;

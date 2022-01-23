enum MessageTypes {
  Ping,
  Pong,
  Identify,
  Position,
  SetPosition,
}

interface IMessage {
  Type: MessageTypes;
  Data?: Map<string, unknown>;
}

export default IMessage;

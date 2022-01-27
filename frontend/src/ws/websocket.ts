// nice and easy way to get types for the

import { User } from "next-auth";
import EventEmitter from "events";
import IdentityData from "../interfaces/Identity";
import { MessageTypes } from "../interfaces/IMessage";
import Message from "../util/Message";
import MessageUtil from "../util/MessageUtil";

// browser socket
let Websocket: typeof WebSocket;
if (typeof window !== "undefined") {
  Websocket = window.WebSocket;
} else {
  Websocket = require("ws");
}

export default class PlayerSocket extends Websocket {
  private clientID: string;
  public emitter: EventEmitter;
  constructor(private user: User) {
    super(process.env.NEXT_PUBLIC_WS_URI);
    this.emitter = new EventEmitter();
    this.clientID = process.env.NEXT_PUBLIC_CLIENT_ID;
    this.onopen = this.onOpen;
    this.onmessage = this.onMessage;
    this.onclose = this.onClose;
  }
  onMessage(evt: MessageEvent<any>) {
    let message = MessageUtil.decode(evt.data);
    if (message.type === MessageTypes["Ping"]) {
      return;
    }
    this.emitter.emit(MessageTypes[message.type], message.data);
  }
  onOpen() {
    this.send(
      MessageUtil.encode(
        new Message(MessageTypes.Identify, {
          clientID: this.clientID,
          user: {
            id: this.user.id,
            name: this.user.name,
          },
        } as IdentityData)
      )
    );
    this.emitter.emit("open");
    this.pingEvent();
  }
  pingEvent() {
    let interval = setInterval(() => {
      if (!this.open) {
        clearInterval(interval);
        return;
      }
      console.log("[WS] running ping event");
      this.send(
        MessageUtil.encode(
          new Message(MessageTypes.Ping, {
            clientID: this.clientID,
          })
        )
      );
    }, 20000);
  }
  onClose(event: CloseEvent) {
    console.log("[WS] socket connection closed");
    console.log(event);
    this.emitter.emit("closed");
  }
  get open() {
    return this.readyState === this.OPEN;
  }
}

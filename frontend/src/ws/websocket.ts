// nice and easy way to get types for the

import { User } from "next-auth";
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
  constructor(private user: User) {
    super(process.env.NEXT_PUBLIC_WS_URI);
    this.onopen = this.onOpen;
  }
  onOpen() {
    this.send(
      MessageUtil.encode(
        new Message(MessageTypes.Identify, {
          clientID: process.env.NEXT_PUBLIC_CLIENT_ID,
          user: {
            id: this.user.id,
            name: this.user.name,
          },
        } as IdentityData)
      )
    );
    this.pingEvent();
  }
  pingEvent() {
    let interval = setInterval(() => {
      if (!this.open) {
        clearInterval(interval);
        return;
      }
      console.log("[WS] running ping event");
      this.send(MessageUtil.encode(new Message(MessageTypes.Ping)));
    }, 20000);
  }
  get open() {
    return this.readyState === this.OPEN;
  }
}

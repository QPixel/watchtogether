import { User } from "next-auth";
import { useEffect, useState } from "react";
import PlayerSocket from "../ws/websocket";

interface useWSProps {
  user: User;
}

// todo write websocket reconnector
const useWS = ({ user }: useWSProps): PlayerSocket | null => {
  if (typeof window === "undefined") {
    return;
  }
  // todo checkout usecallback
  const [socket, setSocket] = useState<PlayerSocket>(null);
  useEffect(() => {
    if (socket !== null) {
      return;
    }
    let internalSocket = new PlayerSocket(user);
    setSocket(internalSocket);
    return () => {
      if (internalSocket.readyState !== WebSocket.OPEN) {
        return internalSocket.close();
      }
    };
  }, []);

  return socket;
};

export default useWS;

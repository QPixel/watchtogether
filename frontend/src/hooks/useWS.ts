import { User } from "next-auth";
import { useEffect, useState } from "react";
import PlayerSocket from "../ws/websocket";

interface useWSProps {
  user: User;
}

// todo write websocket reconnector
const useWS = ({ user }: useWSProps) => {
  if (typeof window === "undefined") {
    return;
  }
  // todo checkout usecallback
  const [socket, setSocket] = useState<PlayerSocket>();
  useEffect(() => {
    let internalSocket = new PlayerSocket(user);
    setSocket(internalSocket);
    return () => {
      return internalSocket.close();
    };
  }, []);

  return socket;
};

export default useWS;

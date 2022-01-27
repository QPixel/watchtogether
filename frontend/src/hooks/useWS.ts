import { User } from "next-auth";
import { useEffect, useState } from "react";
import PlayerSocket from "../ws/websocket";

interface useWSProps {
  user: User;
}

// todo write websocket reconnector
const useWS = ({ user }: useWSProps) => {
  // todo checkout usecallback
  const [socket, setSocket] = useState<PlayerSocket>();
  useEffect(() => {
    let socket = new PlayerSocket(user);
    setSocket(socket);
    return () => {
      return socket.close();
    };
  }, []);
  return socket;
};

export default useWS;

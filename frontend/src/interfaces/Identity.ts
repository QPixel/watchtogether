import IUser from "./IUser";

interface IdentityData {
  admin?: boolean;
  controller?: boolean;
  clientID?: string;
  playlist?: string;
  playhead?: number;
  paused?: boolean;
  user: IUser;
}

export default IdentityData;

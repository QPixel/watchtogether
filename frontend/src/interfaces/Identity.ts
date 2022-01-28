import IUser from "./IUser";

interface IdentityData {
  admin?: boolean;
  controller?: boolean;
  clientID?: string;
  playlist?: string;
  playHead?: number;
  user: IUser;
}

export default IdentityData;

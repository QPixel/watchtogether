import IUser from "./IUser";

interface IdentityData {
  clientID?: string;
  playlist?: string;
  playHead?: number;
  user: IUser;
}

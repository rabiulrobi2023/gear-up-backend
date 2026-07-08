import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../../generated/prisma/enums";

export interface IJwtPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
}
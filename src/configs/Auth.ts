import { SignOptions } from "jsonwebtoken";
import { AUTH_SECRET } from "../../env";

export const auth = {
  jwt: {
    secret: AUTH_SECRET || "default-secret",
    expiresIn: "1d" as SignOptions["expiresIn"],
  },
};

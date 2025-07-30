import { SignOptions } from "jsonwebtoken";

export const authConfig = {
  jwt: {
    secret: "123",
    expiresIn: "1h" as SignOptions["expiresIn"],
  },
  cookie: {
    secret: "345",
  },
};

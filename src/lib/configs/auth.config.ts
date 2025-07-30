import { SignOptions } from "jsonwebtoken";

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "123",
    expiresIn: "1h" as SignOptions["expiresIn"],
  },
};

import * as env from "dotenv";

env.config();

export const config = {
  app: {
    port: Number(process.env.PORT!),
    host: process.env.HOST || "0.0.0.0",
  },
};

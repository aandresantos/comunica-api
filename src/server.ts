import { buildApp } from "./app";
import { config } from "./lib/configs/app.config";

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      host: config.app.host,
      port: config.app.port,
    });
  } catch (e) {}
};

start();

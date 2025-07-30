import "dotenv/config";
import { exec } from "node:child_process";
import util from "node:util";

require("dotenv").config({ path: ".env.test" });

const execAsync = util.promisify(exec);

beforeAll(async () => {
  // await execAsync("npx drizzle-kit push:pg");
});

afterAll(async () => {});

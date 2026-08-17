import { randomBytes, scryptSync } from "node:crypto";
const password = "LumiQA2026!";
const salt = randomBytes(16).toString("hex");
const derived = scryptSync(password, salt, 64).toString("hex");
process.stdout.write(`${salt}:${derived}`);

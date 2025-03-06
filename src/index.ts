import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { getSession, input, saveSessionToFile } from "./utils";

if (!process.env.API_ID || !process.env.API_HASH) {
  throw new Error("API_ID or API_HASH environment variables are missing!");
}

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const stringSession = new StringSession(getSession());
const clientParams = {};

(async () => {
  console.log("Connecting to Telegram...");

  const client = new TelegramClient(
    stringSession,
    apiId,
    apiHash,
    clientParams
  );
  if (!getSession()) {
    console.log("No saved session found. Loggin in...");

    await client.start({
      phoneNumber: () => input("Phone number"),
      phoneCode: () => input("Phone code"),
      onError: (err) => console.log("Authentication error: " + err),
    });

    console.log("Logged in successfully!");

    const sessionHash = client.session.save() as unknown as string;
    saveSessionToFile(sessionHash);
  } else {
    await client.connect();

    console.log("Connected using saved session!");
  }
  await client.sendMessage("me", { message: "Hello!" });
})();

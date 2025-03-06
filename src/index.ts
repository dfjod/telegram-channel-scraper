import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { getSession, input, saveSessionToFile } from "./utils";
import { getConfig } from "./config";

const config = getConfig()

const apiId = config.auth.id;
const apiHash = config.auth.hash;
const stringSession = new StringSession(getSession());
const clientParams = {};
const mode = config.app.mode;
const channels = config.app.channelIds;

(async () => {
    console.log(`Telegram Channel Scrapper running in ${mode} mode...`);
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

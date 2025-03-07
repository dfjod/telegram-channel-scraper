import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { getSession, input, saveSessionToFile } from "./utils";
import { getConfig } from "./config";
import * as fs from "fs";

const DAY = 86400; // Add a date to UNIX timestamp

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

    if (mode === "live") {

    } else {
        // Get messages from date range
        if (config.app.startDate && config.app.endDate) {
            const startDate = new Date(config.app.startDate).getTime() / 1000;
            const endDate = new Date(config.app.endDate).getTime() / 1000;

            console.log(`Getting messages in range ${startDate} - ${endDate}...`);

            const offsetDate = (endDate + DAY);
            console.log(`Offset date: ${offsetDate}`);

            for (const channel of channels) {
                console.log(`Getting messages for ${channel}...`)
                // Messages are in order from most recent to oldest
                const messages = await client.getMessages(channel, { offsetDate: offsetDate }); // Get messages older than offsetDate (exclusive)
                const messagesInRange = messages.filter(message => message.date >= startDate);

                console.log(`Retrieved ${messagesInRange.length} messages`);

                fs.writeFileSync("log.json", JSON.stringify(messagesInRange) + "\n", { flag: "a", encoding: "utf-8" });

                console.log("Messages written to the log file!");
            }
        }
    }
})();

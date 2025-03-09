import dotenv from "dotenv";
import { Config } from "./types";

dotenv.config();

export function getConfig(): Config {
    if (!process.env.API_ID || !process.env.API_HASH || !process.env.MODE || !process.env.CHANNEL_IDS ) {
        throw new Error(
            "API_ID, API_HASH, MODE or CHANNEL_IDS environment variable is missing!"
        );
    }

    if (!["live", "range"].includes(process.env.MODE)) {
        throw new Error(
            "MODE must be either 'live' or 'range'!"
        );
    }

    if (process.env.MODE === "range" && (!process.env.START_DATE && !process.env.END_DATE)) {
        throw new Error(
            "START_DATE and END_DATE environment variables are required if MODE equals to 'range'!"
        );
    }

    let config: Config = {} as Config;

    config.auth = { id: Number(process.env.API_ID), hash: process.env.API_HASH };
    config.app = {
        mode: process.env.MODE as "live" | "range",
        channelIds: process.env.CHANNEL_IDS.split(","),
        receiverUrl: process.env.RECEIVER_URL ?? ""
    };

    if (config.app.mode === "range") {
        config.app.startDate = process.env.START_DATE;
        config.app.endDate = process.env.END_DATE;
    }

    return config
}

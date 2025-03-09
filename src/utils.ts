import { createInterface } from "readline";
import * as fs from "fs";
import { Message } from "./types";
import { Api } from "telegram";
import { request } from "https";

export async function input(question: string): Promise<string> {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question + ": ", (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

export function getSession(sessionFile: string = "session.txt"): string {
    return fs.existsSync(sessionFile)
        ? fs.readFileSync(sessionFile, "utf-8")
        : "";
}

export function saveSessionToFile(
    sessionHash: string,
    filePath: string = "session.txt"
): void {
    try {
        fs.writeFileSync(filePath, sessionHash, "utf-8");
        console.log(`Session saved successfully to ${filePath}`);
    } catch (error) {
        console.error("Failed to save session:", error);
        process.exit();
    }
}

export function mapTelegramMessage(message: Api.Message, channel: string): Message {
    return {
        id: message.id,
        date: message.date,
        channel: channel,
        content: message.message,
        hasMedia: message.media !== null,
        views: message.views ?? 0,
        reactions: message.reactions?.results.reduce((sum, result) => sum + result.count, 0) ?? 0
    }
}

export function sendScrapeResult(url: string, data: Message): void {
    const dataJson = JSON.stringify(data);
    const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Content-Length": Buffer.byteLength(dataJson)
        }
    }
    const req = request(url, options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on("end", () => {
            console.log("No more data in response.");
        });
    });

    req.on("error", (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(dataJson);
    req.end();
}

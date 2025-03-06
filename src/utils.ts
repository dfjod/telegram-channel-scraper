import { createInterface } from "readline";
import * as fs from "fs";

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

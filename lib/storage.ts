import fs from "fs";
import path from "path";
import { EsgData } from "./types";

const DATA_FILE = path.join(process.cwd(), "data", "esg-data.json");

export function readEsgData(): EsgData | null {
  try {
    if (!fs.existsSync(DATA_FILE)) return null;
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw) as EsgData;
  } catch {
    return null;
  }
}

export function writeEsgData(data: EsgData): void {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

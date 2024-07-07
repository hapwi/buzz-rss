import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  const filePath = path.resolve(".", "public", "feed.xml");
  const xmlContent = await fs.readFile(filePath, "utf8");

  res.setHeader("Content-Type", "application/rss+xml");
  res.status(200).send(xmlContent);
}

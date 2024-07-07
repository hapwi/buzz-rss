import { promises as fs } from "fs";
import path from "path";

export default async function handler(req, res) {
  try {
    console.log("Request received:", req.query);

    const { type, filename } = req.query;

    if (type === "xml") {
      const filePath = path.resolve(".", "public", "feed.xml");
      console.log("Reading XML file from:", filePath);
      const xmlContent = await fs.readFile(filePath, "utf8");

      res.setHeader("Content-Type", "application/rss+xml");
      res.status(200).send(xmlContent);
    } else if (type === "video") {
      const filePath = path.resolve(".", "public", "mp4", filename);
      console.log("Streaming video file from:", filePath);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        console.error("File not found:", filePath);
        return res.status(404).send("File not found");
      }

      // Set CORS headers
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );

      // Set proper content type for video
      res.setHeader("Content-Type", "video/mp4");

      // Stream the video file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } else {
      console.log("Invalid request type:", type);
      res.status(400).send("Invalid request");
    }
  } catch (error) {
    console.error("Error in handler:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}

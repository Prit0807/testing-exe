import { promises as fs } from "fs";
import path from "path";

const filePath = path.join("/tmp", "phone.json");

export async function handler(event) {
  try {
    if (event.httpMethod === "POST") {
      const { phone } = JSON.parse(event.body || "{}");
      await fs.writeFile(filePath, JSON.stringify({ phone }), "utf-8");
      return { statusCode: 200, body: JSON.stringify({ success: true, phone }) };
    }

    if (event.httpMethod === "GET") {
      try {
        const data = JSON.parse(await fs.readFile(filePath, "utf-8"));
        return { statusCode: 200, body: JSON.stringify({ success: true, phone: data.phone }) };
      } catch {
        return { statusCode: 200, body: JSON.stringify({ success: true, phone: "+18882130902" }) };
      }
    }

    return { statusCode: 405, body: "Method not allowed" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ success: false, message: "Internal error" }) };
  }
}

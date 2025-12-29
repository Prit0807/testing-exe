const express = require("express");
const cors = require("cors");

const app = express();

// Allow all origins for development; restrict in production
app.use(cors());
app.use(express.json());

// In-memory store (replace with DB for production)
let storedPhone = "";

// Get current phone
app.get("/api/phone", (req, res) => {
  res.json({ phone: storedPhone });
});

// Save/update phone
app.post("/api/phone", (req, res) => {
  const phone = req.body?.phone || "";
  storedPhone = phone;
  res.json({ ok: true, phone: storedPhone });
});

// Open EXE endpoint - Ubuntu VPS માટે સુધારેલો કોડ
app.post("/api/open-ps", (req, res) => {
  const { exec } = require("child_process");
  const path = require("path");
  const os = require("os");
  
  // ફાઈલનો સાચો પાથ (ખાતરી કરો કે 'exe' ફોલ્ડર અને ફાઈલ ત્યાં છે)
  const exePath = path.join(__dirname, "public", "exe", "exeProject.exe");
  const platform = os.platform();

  console.log(`Executing on platform: ${platform}`);

  if (platform === "linux") {
    // Ubuntu પર EXE ચલાવવા માટે Wine નો ઉપયોગ
    // 'xvfb-run' નો ઉપયોગ જો તમારી EXE ને GUI (વિન્ડો) જોઈતી હોય
    const command = `wine "${exePath}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Wine execution error:", error);
        return res.status(500).json({ ok: false, error: error.message });
      }
      console.log("Output:", stdout);
      res.json({ ok: true, message: "EXE started via Wine on Ubuntu" });
    });
  } else if (platform === "win32") {
    // આ કોડ ત્યારે જ ચાલશે જો તમે લોકલ વિન્ડોઝ પર ટેસ્ટ કરતા હોવ
    const command = `start "" "${exePath}"`;
    exec(command, (err) => {
      if (err) return res.status(500).json({ ok: false, error: err.message });
      res.json({ ok: true, message: "Started on Windows" });
    });
  }
});

// Serve static files from public folder (exe file access mate)
app.use(express.static("public"));

// Bind to 0.0.0.0 so phones on LAN can reach it
// Production ma (Ubuntu VPS) PORT environment variable thi aave
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
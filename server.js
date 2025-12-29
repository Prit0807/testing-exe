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

// Open EXE endpoint - Windows par PowerShell thi, Linux par wine/alternative
app.post("/api/open-ps", (req, res) => {
  console.log('open-ps endpoint called');
  const { exec } = require("child_process");
  const path = require("path");
  const os = require("os");
  
  try {
    const exePath = path.join(__dirname, "exe/exeProject.exe");
    const platform = os.platform();
    
    let command;
    
    if (platform === "win32") {
      // Windows: PowerShell use karo
      command = `cmd.exe /c start "" powershell.exe -NoExit -WindowStyle Hidden -Command "Start-Process '${exePath}' -Verb RunAs"`;
      
      exec(command, {
        detached: true,
        windowsHide: true
      }, (error, stdout, stderr) => {
        if (error) {
          console.error("Error:", error);
          res.status(500).json({ ok: false, error: error.message });
          return;
        }
        if (stdout) console.log("Output:", stdout);
        if (stderr) console.error("Stderr:", stderr);
        res.json({ ok: true, message: "EXE execution started on Windows" });
      });
    } else if (platform === "linux") {
      // Linux: Wine use karo (agar install che) ya download link return karo
      // Note: Wine install kariye: sudo apt-get install wine
      const wineCommand = `wine "${exePath}"`;
      
      exec(wineCommand, {
        detached: true
      }, (error, stdout, stderr) => {
        if (error) {
          console.error("Wine error (maybe not installed):", error);
          // Fallback: exe file path return karo for download
          res.json({ 
            ok: false, 
            message: "Wine not installed. EXE file available for download.",
            downloadUrl: `/exe/exeProject.exe`,
            error: "Install Wine: sudo apt-get install wine"
          });
          return;
        }
        if (stdout) console.log("Output:", stdout);
        if (stderr) console.error("Stderr:", stderr);
        res.json({ ok: true, message: "EXE execution started via Wine on Linux" });
      });
    } else {
      // macOS ya other platforms
      res.json({ 
        ok: false, 
        message: "Platform not supported for direct execution",
        downloadUrl: `/exe/exeProject.exe`
      });
    }
  } catch (error) {
    console.error("Error executing EXE:", error);
    res.status(500).json({ ok: false, error: error.message });
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
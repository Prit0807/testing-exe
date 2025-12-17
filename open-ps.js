const { spawn } = require("child_process");

const ps = spawn("powershell.exe", ["-NoExit"], {
  detached: true,
  stdio: "ignore",
  shell: true
});

// Parent process thi disconnect karo, jethi PowerShell independent run thay
ps.unref();

console.log("PowerShell opened!");

const path = require("path");
const { spawn } = require("child_process");

const CORE_PORT = 17890;
let child = null;

function spawnCore(){
  return new Promise((resolve, reject) => {
    if (child) return resolve();
    const entry = path.join(__dirname, "..", "scripts", "run-core.js");
    child = spawn(process.execPath, [entry, String(CORE_PORT)], { stdio: ["ignore", "pipe", "pipe"] });

    const t = setTimeout(() => reject(new Error("Core did not start")), 8000);

    child.stdout.on("data", (d) => {
      const s = d.toString();
      if (s.includes("CORE_READY")) { clearTimeout(t); resolve(); }
    });
  });
}

function stopCore(){
  return new Promise((resolve) => {
    if (!child) return resolve();
    child.once("exit", () => resolve());
    try { child.kill(); } catch(e){ resolve(); }
  });
}

module.exports = { CORE_PORT, spawnCore, stopCore };

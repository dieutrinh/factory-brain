const fs = require("fs");
const { ensureRuntime } = require("./runtime-init");

let logFile = null;
function log(...args) {
  try {
    const msg = args.map(a => (typeof a === "string" ? a : JSON.stringify(a))).join(" ");
    if (logFile) fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
  } catch {}
}

process.on("uncaughtException", (err) => {
  log("uncaughtException:", err?.stack || err?.message || String(err));
});

process.on("unhandledRejection", (reason) => {
  log("unhandledRejection:", reason?.stack || reason?.message || String(reason));
});

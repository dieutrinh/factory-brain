const fs = require("fs");
const path = require("path");
const { app } = require("electron");

function ensureRuntime() {
  const base = path.join(app.getPath("userData"), "runtime");
  const dirs = ["data", "imports", "exports", "templates", "logs"];

  if (!fs.existsSync(base)) {
    fs.mkdirSync(base, { recursive: true });
  }

  for (const d of dirs) {
    const p = path.join(base, d);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }

  return base;
}

module.exports = { ensureRuntime };

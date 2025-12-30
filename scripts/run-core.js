const path = require("path");

const PORT = Number(process.argv[2] || 17890);
const rootDir = path.join(__dirname, "..");
const jobsDir = path.join(rootDir, "runtime", "jobs");

const { createApp } = require(path.join(rootDir, "core", "service", "server.js"));
const app = createApp({ jobsDir });

const server = app.listen(PORT, "127.0.0.1", () => {
  process.stdout.write(`CORE_READY port=${PORT}\n`);
});

process.on("SIGINT", () => server.close(() => process.exit(0)));
process.on("SIGTERM", () => server.close(() => process.exit(0)));

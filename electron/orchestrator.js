// electron/orchestrator.js
// Safe mode: DO NOT spawn any child processes.
// This prevents infinite spawning / background zombies.

async function start() {
  // no-op
  return true;
}

async function stop() {
  // no-op
  return true;
}

module.exports = { start, stop };

// electron/orchestrator.js
// SAFE MODE – không spawn core, không fork, không exec

async function start() {
  return true;
}

async function stop() {
  return true;
}

module.exports = { start, stop };

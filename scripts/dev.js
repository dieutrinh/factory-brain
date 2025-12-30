const { spawn } = require("child_process");
const path = require("path");

const core = spawn(process.execPath, [path.join(__dirname, "run-core.js"), "17890"], { stdio: "inherit" });

const electronBin = require("electron");
const elec = spawn(electronBin, ["."], { stdio: "inherit" });

function cleanup(){ try{elec.kill();}catch(e){} try{core.kill();}catch(e){} }
process.on("SIGINT", ()=>{ cleanup(); process.exit(0); });
process.on("SIGTERM", ()=>{ cleanup(); process.exit(0); });

const express = require("express");
const fs = require("fs");
const path = require("path");

const { matrixPack } = require("../service-shim/layout");
const { detectRisks } = require("../service-shim/risk");
const { trustScore } = require("../service-shim/trust");
const { ripExport } = require("../service-shim/rip");
const { memorySnapshot } = require("../service-shim/memory");
const { choosePreviewMode } = require("../service-shim/previewMode");
const { degradeLevel } = require("../service-shim/degrade");
const { signPayload } = require("../service-shim/sign");

function ensureDir(p){ fs.mkdirSync(p, { recursive: true }); }

function createApp({ jobsDir }) {
  const app = express();
  app.use(express.json({ limit: "25mb" }));

  app.get("/api/health", (req,res) => res.json({ ok:true, service:"factory-brain-core", version:"2.0.0-test" }));
  app.get("/api/memory", (req,res) => res.json({ ok:true, memory: memorySnapshot() }));

  app.post("/api/jobs/create", (req,res) => {
    const job = req.body || {};
    const jobId = job.jobId || `job_${Date.now()}`;
    const jobDir = path.join(jobsDir, jobId);
    ensureDir(path.join(jobDir, "artifacts"));
    ensureDir(path.join(jobDir, "output", "preview"));
    ensureDir(path.join(jobDir, "output", "rip"));
    fs.writeFileSync(path.join(jobDir, "job.json"), JSON.stringify(job, null, 2), "utf-8");
    res.json({ ok:true, jobId, jobDir });
  });

  app.post("/api/layout/optimize", (req,res) => {
    const { jobId, items, plate } = req.body || {};
    if (!jobId) return res.status(400).json({ ok:false, error:"missing_jobId" });
    const jobDir = path.join(jobsDir, jobId);
    const layout = matrixPack(items || [], plate || { width: 1000, height: 700 });
    fs.writeFileSync(path.join(jobDir, "output", "layout.json"), JSON.stringify(layout, null, 2), "utf-8");
    res.json({ ok:true, layout });
  });

  app.post("/api/trust/score", (req,res) => {
    const { jobId, job } = req.body || {};
    if (!jobId) return res.status(400).json({ ok:false, error:"missing_jobId" });
    const jobDir = path.join(jobsDir, jobId);
    const risks = detectRisks(job || {});
    const scored = trustScore({ issues: risks.issues });
    fs.writeFileSync(path.join(jobDir, "output", "trust.json"), JSON.stringify(scored, null, 2), "utf-8");
    res.json({ ok:true, trust: scored, risks });
  });

  app.post("/api/preview/render", (req,res) => {
    const { jobId, interactive=false, lowMemory=false } = req.body || {};
    if (!jobId) return res.status(400).json({ ok:false, error:"missing_jobId" });
    const mode = choosePreviewMode({ interactive, lowMemory });
    const level = degradeLevel(mode);
    res.json({ ok:true, mode, level });
  });

  app.post("/api/rip/export", (req,res) => {
    const { jobId, payload } = req.body || {};
    if (!jobId) return res.status(400).json({ ok:false, error:"missing_jobId" });
    const jobDir = path.join(jobsDir, jobId);
    const signed = signPayload(payload || {});
    const out = ripExport(jobDir, { payload, signed });
    res.json({ ok:true, out, signed });
  });

  return app;
}

module.exports = { createApp };

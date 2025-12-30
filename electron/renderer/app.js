let CORE_PORT = null;
let JOB_ID = null;

function $(id){ return document.getElementById(id); }

async function coreFetch(path, opts){
  const url = `http://127.0.0.1:${CORE_PORT}${path}`;
  const res = await fetch(url, Object.assign({ headers: { "Content-Type": "application/json" } }, opts||{}));
  return res.json();
}

function setOut(obj){ $("out").textContent = JSON.stringify(obj, null, 2); }
function setStatus(){ $("jobStatus").textContent = JOB_ID ? `job: ${JOB_ID}` : "job: none"; }

async function init(){
  CORE_PORT = await window.fb.getCorePort();
  const health = await coreFetch("/api/health");
  $("coreStatus").textContent = health.ok ? `core: ok @${CORE_PORT}` : "core: down";
  $("jobJson").value = JSON.stringify({
    jobId: `job_${Date.now()}`,
    quantity: 500,
    bleed: 3,
    diecut: { type: "rect", w: 100, h: 150 },
    plate: { width: 1000, height: 700 },
    items: [
      { id: "A", w: 120, h: 160 },
      { id: "B", w: 120, h: 160 },
      { id: "C", w: 120, h: 160 },
      { id: "D", w: 120, h: 160 }
    ]
  }, null, 2);
}

$("btnNew").onclick = async () => {
  const job = JSON.parse($("jobJson").value || "{}");
  const created = await coreFetch("/api/jobs/create", { method:"POST", body: JSON.stringify(job) });
  if (created.ok){ JOB_ID = created.jobId; setStatus(); }
  setOut(created);
};

$("btnOpen").onclick = async () => {
  const pick = await window.fb.openJobJson();
  if (!pick.ok) return;
  const txt = await window.fb.readText(pick.path);
  $("jobJson").value = txt;
};

$("btnOptimize").onclick = async () => {
  const job = JSON.parse($("jobJson").value || "{}");
  if (!JOB_ID){
    const created = await coreFetch("/api/jobs/create", { method:"POST", body: JSON.stringify(job) });
    if (created.ok) JOB_ID = created.jobId;
    setStatus();
  }
  const out = await coreFetch("/api/layout/optimize", { method:"POST", body: JSON.stringify({ jobId: JOB_ID, items: job.items||[], plate: job.plate }) });
  setOut(out);
};

$("btnTrust").onclick = async () => {
  const job = JSON.parse($("jobJson").value || "{}");
  if (!JOB_ID){
    const created = await coreFetch("/api/jobs/create", { method:"POST", body: JSON.stringify(job) });
    if (created.ok) JOB_ID = created.jobId;
    setStatus();
  }
  const out = await coreFetch("/api/trust/score", { method:"POST", body: JSON.stringify({ jobId: JOB_ID, job }) });
  if (out.ok){
    $("trustScore").textContent = out.trust.score;
    $("trustGrade").textContent = out.trust.grade;
  }
  setOut(out);
};

$("btnPreview").onclick = async () => {
  if (!JOB_ID) return setOut({ ok:false, error:"Create job first" });
  const out = await coreFetch("/api/preview/render", { method:"POST", body: JSON.stringify({ jobId: JOB_ID, interactive: true, lowMemory: false }) });
  if (out.ok) $("previewMode").textContent = out.mode;
  setOut(out);
};

$("btnRip").onclick = async () => {
  if (!JOB_ID) return setOut({ ok:false, error:"Create job first" });
  const payload = { jobId: JOB_ID, at: new Date().toISOString(), note: "placeholder rip export" };
  const out = await coreFetch("/api/rip/export", { method:"POST", body: JSON.stringify({ jobId: JOB_ID, payload }) });
  setOut(out);
};

init().catch(err => setOut({ ok:false, err: String(err) }));

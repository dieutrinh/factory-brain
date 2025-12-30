export async function pingCore(port:number){ const r=await fetch(`http://127.0.0.1:${port}/api/health`); return r.json(); }

export function detectRisks(job:any){ const issues:string[]=[]; if(!job?.diecut) issues.push('missing_diecut'); if((job?.bleed??0)<2) issues.push('bleed_too_small'); return {issues}; }

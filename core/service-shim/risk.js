module.exports.detectRisks = (job)=>{ const issues=[]; if(!job||!job.diecut) issues.push('missing_diecut'); if(((job&&job.bleed)||0)<2) issues.push('bleed_too_small'); return {issues}; };

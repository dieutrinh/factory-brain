export function validateDiecut(d:any){ return {ok:!!d, issues: d?[]:['missing_diecut']} }

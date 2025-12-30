module.exports.trustScore = ({issues})=>{ const p=(issues?issues.length:0)*12; const s=Math.max(0,100-p); const g=s>=90?'A':s>=75?'B':s>=60?'C':'D'; return {score:s,grade:g,issues:issues||[]}; };

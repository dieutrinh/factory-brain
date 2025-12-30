export function degradeLevel(m:'wireframe'|'proxy'|'full'){ return m==='wireframe'?{dpi:30,detail:0.1}:m==='proxy'?{dpi:72,detail:0.4}:{dpi:150,detail:1.0}; }

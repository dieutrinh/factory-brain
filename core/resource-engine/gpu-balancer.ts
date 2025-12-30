export function choosePreviewMode(h:{interactive?:boolean,lowMemory?:boolean}){ return h.lowMemory?'wireframe':h.interactive?'proxy':'full'; }

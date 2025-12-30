export function computeQuantity(job:any){ const q=Number(job?.quantity??1); return {quantity:q, sheets:Math.ceil(q/100), runs:1} }

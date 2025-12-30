export function matrixPack(items:any[], plate:any){ return {placements: items.map((it,i)=>({id:it.id||i,x:i*10,y:0,w:it.w||100,h:it.h||100,rot:0})), stats:{algo:'placeholder'}} }

function matrixPack(items, plate){
  let x=0,y=0,rowH=0;
  const placements=[];
  const W = (plate && plate.width) || 1000;
  for (const it of (items||[])){
    const w = it.w||100, h = it.h||100;
    if (x + w > W){ x=0; y += rowH + 10; rowH=0; }
    placements.push({ id: it.id, x, y, w, h, rot: 0 });
    x += w + 10;
    if (h>rowH) rowH=h;
  }
  return { placements, stats: { algo: "naive-row" } };
}
module.exports = { matrixPack };

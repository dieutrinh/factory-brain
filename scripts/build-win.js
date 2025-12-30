const {spawnSync}=require('child_process'); const r=spawnSync('npx',['electron-builder','--win','--x64','-c','electron-builder.json'],{stdio:'inherit',shell:true}); process.exit(r.status||0);

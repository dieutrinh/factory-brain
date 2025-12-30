module.exports.choosePreviewMode=({interactive=false,lowMemory=false})=> lowMemory?'wireframe':interactive?'proxy':'full';

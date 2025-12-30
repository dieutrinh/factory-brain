const crypto=require('crypto'); module.exports.signPayload=(p)=>{const h=crypto.createHash('sha256').update(JSON.stringify(p||{})).digest('hex');return {algo:'sha256',hash:h};};

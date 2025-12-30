module.exports.memorySnapshot=()=>{const m=process.memoryUsage();return {rss:m.rss,heapUsed:m.heapUsed,heapTotal:m.heapTotal,external:m.external};};

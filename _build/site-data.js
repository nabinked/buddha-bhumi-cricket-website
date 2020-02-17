const klawsync = require('klaw-sync');
const path = require('path');
const fsextra = require('fs-extra');

module.exports = (dataDir) => klawsync(dataDir, {
    filter: f => f.path.endsWith('.json'),
    depthLimit: 0,
    nodir: true
}).reduce((acc, f) => {
    const dataKey = path.basename(f.path).split('.')[0];
    if (dataKey) {
        return {
            ...acc,
            [dataKey]: JSON.parse(fsextra.readFileSync(f.path))
        }
    }
}, {});
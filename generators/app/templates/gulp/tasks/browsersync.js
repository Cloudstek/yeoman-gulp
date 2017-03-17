const readPkg = require('read-pkg');
const sync = require('browser-sync');

var task = function (done) {
    readPkg().then(pkg => {
        // Load options from package.json "browserSync"
        let options = pkg.browserSync || {};

        // Init browser-sync
        sync.init(options);
    });
};

module.exports = [['build'], task];

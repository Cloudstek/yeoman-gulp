const pkg = require('../../package.json');
const sync = require('browser-sync');

var task = function () {
    // Load options from package.json "browserSync"
    var options = pkg.browserSync === undefined ? {} : pkg.browserSync;

    // Init browser-sync
    sync.init(options);
};

<% if (tasks.indexOf('less') >= 0) { -%>
module.exports = [['less'], task];
<% } else { -%>
module.exports = task;
<% } -%>

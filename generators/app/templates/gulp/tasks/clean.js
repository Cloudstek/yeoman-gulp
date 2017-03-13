var gulp = require('gulp'),
    util = require('gulp-util'),
    del = require('del');

var task = function() {
    return del([
        'assets/**'
    ]).then(paths => {
        if(paths.length > 0) {
            util.log('Cleaned files:\n' + util.colors.magenta(paths.join('\n')));
        }
    });
};

module.exports = task;

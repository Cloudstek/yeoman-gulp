var gulp = require('gulp');

var task = function (done) {
    gulp.watch('src/less/**/*.less', ['less']);
    gulp.watch('src/js/**/*.js', ['babel']);
};

module.exports = task;

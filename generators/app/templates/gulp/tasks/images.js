const gulp = require('gulp');
const compress = require('gulp-imagemin');

var task = function() {
    return gulp.src('<%= src.img %>/**/*')
        .pipe(compress())
        .pipe(gulp.dest('<%= dest.img %>'));
};

module.exports = task;
